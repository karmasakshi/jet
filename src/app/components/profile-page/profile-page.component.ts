import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  Signal,
  viewChild,
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
import { AVATAR_FILE_MAX_SIZE } from '@jet/constants/avatar-file-max-size.constant';
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

  public readonly avatarFileInput: Signal<
    ElementRef<HTMLInputElement> | undefined
  > = viewChild<ElementRef<HTMLInputElement>>('avatarFileInput');

  public profile: null | Profile;
  public readonly profileFormGroup: FormGroup<{
    username: FormControl<null | string>;
  }>;
  public readonly user: null | User;

  public constructor() {
    this.#isLoading = false;

    this.profile = null;

    this.profileFormGroup = this.#formBuilder.group({
      username: this.#formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36),
        Validators.pattern(/^[a-z0-9_]+$/),
      ]),
    });

    this.user = this.#userService.user();

    this.#loggerService.logComponentInitialization('ProfilePageComponent');
  }

  public ngOnInit(): void {
    void this.#selectProfile();
  }

  public hasUnsavedChanges(): boolean {
    return this.profileFormGroup.dirty;
  }

  public async replaceAvatar(): Promise<void> {
    const files: FileList | null | undefined =
      this.avatarFileInput()?.nativeElement.files;

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

    if (file.size > AVATAR_FILE_MAX_SIZE) {
      this.#alertService.showAlert(
        this.#translocoService.translate(
          'alerts.please-select-a-smaller-avatar',
          { value: AVATAR_FILE_MAX_SIZE / (1024 * 1024) },
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
        this.profile?.avatar_url ?? '',
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

      await this.#profileService.updateProfile({ avatar_url: avatarUrl });

      if (this.profile) {
        this.profile.avatar_url = avatarUrl;
      }

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
      await this.#profileService.updateProfile(partialProfile);

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

  async #selectProfile(): Promise<void> {
    if (this.#isLoading) {
      return;
    }

    this.#isLoading = true;
    this.profileFormGroup.disable();
    this.#progressBarService.showQueryProgressBar();

    try {
      const { data } = await this.#profileService.selectProfile();

      this.profile = data;

      this.profileFormGroup.patchValue({ username: data.username });
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
