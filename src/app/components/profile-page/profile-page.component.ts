import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  Signal,
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
import { AVATAR_FILE_MAX_SIZE_MB } from '@jet/constants/avatar-file-max-size-mb.constant';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { Profile } from '@jet/interfaces/profile.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProfileService } from '@jet/services/profile/profile.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';
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
  styleUrl: './profile-page.component.scss',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements CanComponentDeactivate, OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #profileService = inject(ProfileService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);
  readonly #translocoService = inject(TranslocoService);

  #isLoading: boolean;
  readonly #user: null | User;

  protected readonly avatarFileInputRef: Signal<
    ElementRef<HTMLInputElement> | undefined
  > = viewChild<ElementRef<HTMLInputElement>>('avatarFileInput');

  public readonly emailFormGroup: FormGroup<{
    email: FormControl<null | string>;
  }>;
  public readonly profile: WritableSignal<Profile | undefined>;
  public readonly profileFormGroup: FormGroup<{
    full_name: FormControl<null | string>;
    username: FormControl<null | string>;
  }>;

  public constructor() {
    this.#isLoading = false;

    this.#user = this.#userService.user();

    this.emailFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null),
    });

    this.profile = signal(undefined);

    this.profileFormGroup = this.#formBuilder.group({
      full_name: this.#formBuilder.control<null | string>(null, [
        Validators.maxLength(36),
      ]),
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

    this.emailFormGroup.patchValue({ email: this.#user?.email ?? null });

    void this.#selectProfile();
  }

  public hasUnsavedChanges(): boolean {
    return this.profileFormGroup.dirty;
  }

  public async replaceAvatar(): Promise<void> {
    const files: FileList | null | undefined =
      this.avatarFileInputRef()?.nativeElement.files;

    if (files?.length !== 1) {
      return;
    }

    const file: File | undefined = files[0];

    if (!file?.type.startsWith('image/')) {
      this.#alertService.showAlert(
        this.#translocoService.translate('alerts.please-select-a-valid-avatar'),
      );

      return;
    }

    if (file.size > AVATAR_FILE_MAX_SIZE_MB * 1024 * 1024) {
      this.#alertService.showAlert(
        this.#translocoService.translate(
          'alerts.please-select-a-smaller-avatar',
          { value: AVATAR_FILE_MAX_SIZE_MB },
        ),
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

      response = await this.#profileService.deleteAvatar(
        this.profile()?.avatar_url ?? '',
      );

      if (response.error) {
        throw response.error;
      }

      response = await this.#profileService.uploadAvatar(file);

      if (response.error) {
        throw response.error;
      }

      const avatarUrl: string = this.#profileService.getAvatarPublicUrl(
        response.data.path,
      );

      const { data } = await this.#profileService.updateAndSelectProfile({
        avatar_url: avatarUrl,
      });

      this.profile.set(data);

      this.#alertService.showAlert(
        this.#translocoService.translate('alerts.avatar-updated'),
      );
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

  public async updateProfile(partialProfile: Partial<Profile>): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.profileFormGroup.disable();
    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const { data } =
        await this.#profileService.updateAndSelectProfile(partialProfile);

      this.profile.set(data);

      this.#patchProfileFormGroup(data);

      this.profileFormGroup.markAsPristine();

      this.#alertService.showAlert(
        this.#translocoService.translate('alerts.profile-updated'),
      );
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

  #patchProfileFormGroup(profile: Profile): void {
    this.profileFormGroup.patchValue({
      full_name: profile.full_name,
      username: profile.username,
    });
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
