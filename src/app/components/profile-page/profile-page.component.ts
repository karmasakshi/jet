import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AVATAR_MAX_SIZE_MB } from '@jet/constants/avatar-max-size-mb.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProfileService } from '@jet/services/profile/profile.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { ProfileRow, ProfileUpdate } from '@jet/types/profile.type';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { JwtPayload } from '@supabase/supabase-js';
import { PageComponent } from '../page/page.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    AnalyticsDirective,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-profile-page',
  styleUrl: './profile-page.component.css',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements CanComponentDeactivate, OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #profileService = inject(ProfileService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);

  readonly #claims: JwtPayload | null;
  #isLoading: boolean;

  protected readonly avatarFileInputRef =
    viewChild<ElementRef<HTMLInputElement>>('avatarFileInput');

  protected readonly emailFormGroup: FormGroup<{ email: FormControl<null | string> }>;
  protected readonly profile: WritableSignal<ProfileRow | undefined>;
  protected readonly profileFormGroup: FormGroup<{
    name: FormControl<null | string>;
    username: FormControl<null | string>;
  }>;

  public constructor() {
    this.#claims = this.#userService.claims();

    this.#isLoading = false;

    this.emailFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null),
    });

    this.profile = signal(undefined);

    this.profileFormGroup = this.#formBuilder.group({
      name: this.#formBuilder.control<null | string>(null, [Validators.maxLength(60)]),
      username: this.#formBuilder.control<null | string>(null, [
        Validators.maxLength(36),
        Validators.minLength(3),
        Validators.pattern(/^[a-z0-9_]+$/),
        Validators.required,
      ]),
    });

    this.#loggerService.logComponentInitialization('ProfilePageComponent');
  }

  public ngOnInit(): void {
    this.emailFormGroup.disable();

    this.emailFormGroup.patchValue({ email: this.#claims?.email ?? null });

    void this.#selectProfile();
  }

  public hasUnsavedChanges(): boolean {
    return this.profileFormGroup.dirty;
  }

  protected async replaceAvatar(): Promise<void> {
    const files: FileList | null | undefined = this.avatarFileInputRef()?.nativeElement.files;

    if (files?.length !== 1) {
      return;
    }

    const file: File | undefined = files[0];

    if (!file?.type.startsWith('image/')) {
      this.#alertService.showAlert(translate('alerts.please-select-a-valid-avatar'));

      return;
    }

    if (file.size > AVATAR_MAX_SIZE_MB * 1024 * 1024) {
      this.#alertService.showAlert(
        translate('alerts.please-select-an-avatar-lte-x-mb', { x: AVATAR_MAX_SIZE_MB }),
      );

      return;
    }

    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.profileFormGroup.disable();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      let response;

      response = await this.#profileService.deleteAvatar(this.profile()?.avatar_url ?? '');

      if (response.error) {
        throw response.error;
      }

      response = await this.#profileService.uploadAvatar(file);

      if (response.error) {
        throw response.error;
      }

      const avatarUrl: string = this.#profileService.getAvatarPublicUrl(response.data.path);

      const { data } = await this.#profileService.updateAndSelectProfile({ avatar_url: avatarUrl });

      this.profile.set(data);

      this.#alertService.showAlert(translate('alerts.avatar-updated'));
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.profileFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected async updateProfile(profile: ProfileUpdate): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.profileFormGroup.disable();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data } = await this.#profileService.updateAndSelectProfile(profile);

      this.profile.set(data);

      this.#patchProfileFormGroup(data);

      this.profileFormGroup.markAsPristine();

      this.#alertService.showAlert(translate('alerts.profile-updated'));
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.profileFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  #patchProfileFormGroup(profile: ProfileRow): void {
    this.profileFormGroup.patchValue({ name: profile.name, username: profile.username });
  }

  async #selectProfile(): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;

    this.profileFormGroup.disable();

    this.#progressBarService.showQueryProgressBar();

    try {
      const { data } = await this.#profileService.selectProfile();

      this.profile.set(data);

      this.#patchProfileFormGroup(data);
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this.#loggerService.logError(exception);
        this.#alertService.showErrorAlert(exception.message);
      } else {
        this.#loggerService.logException(exception);
      }
    } finally {
      this.#isLoading = false;
      this.profileFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }
}
