import { DatePipe, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AnalyticsDirective } from '@jet/directives/analytics/analytics.directive';
import { CanComponentDeactivate } from '@jet/interfaces/can-component-deactivate.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProfileService } from '@jet/services/profile/profile.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { closeFillIcon } from '@jet/svgs/close-fill';
import { deleteFillIcon } from '@jet/svgs/delete-fill';
import { editFillIcon } from '@jet/svgs/edit-fill';
import { ProfileRow, ProfileUpdate } from '@jet/types/supabase/profile.type';
import { addSvgIconLiteral } from '@jet/utilities/add-svg-icon-literal.utility';
import { translate, TranslocoModule } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';
import { PageComponent } from '../page/page.component';

@Component({
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
    MatTooltipModule,
    RouterLink,
    AnalyticsDirective,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-profile-page',
  styles: `
    .profile-card-header {
      align-items: center;
      gap: 16px;
      padding-bottom: 24px;
    }

    .profile-avatar-preview {
      border-radius: 50%;
      flex: 0 0 auto;
      height: 96px;
      object-fit: cover;
      width: 96px;
    }

    .profile-avatar-actions {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .profile-avatar-copy {
      min-width: 0;
      overflow: hidden;
    }

    .profile-file-input {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  `,
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent implements CanComponentDeactivate, OnInit {
  readonly #formBuilder = inject(FormBuilder);
  readonly #alertService = inject(AlertService);
  readonly #loggerService = inject(LoggerService);
  readonly #profileService = inject(ProfileService);
  readonly #progressBarService = inject(ProgressBarService);
  readonly #userService = inject(UserService);

  #isLoading: boolean;
  readonly #user: Signal<null | User>;

  protected readonly identityFormGroup: FormGroup<{
    email: FormControl<null | string>;
    phone: FormControl<null | string>;
  }>;
  protected readonly hasEmail: Signal<boolean>;
  protected readonly hasPhone: Signal<boolean>;
  protected readonly profile: WritableSignal<ProfileRow | undefined>;
  protected readonly profileFormGroup: FormGroup<{
    name: FormControl<null | string>;
    username: FormControl<null | string>;
  }>;

  public constructor() {
    addSvgIconLiteral([closeFillIcon, deleteFillIcon, editFillIcon]);

    this.#isLoading = false;

    this.#user = this.#userService.user;
    this.hasEmail = this.#userService.hasEmail;
    this.hasPhone = computed(() => Boolean(this.#user()?.phone));

    this.identityFormGroup = this.#formBuilder.group({
      email: this.#formBuilder.control<null | string>(null),
      phone: this.#formBuilder.control<null | string>(null),
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
    this.identityFormGroup.disable();

    const user = this.#user();

    this.identityFormGroup.patchValue({
      email: user?.email ?? null,
      phone: user?.phone ? `+${user.phone}` : null,
    });

    void this.#selectProfile();
  }

  public hasUnsavedChanges(): boolean {
    return this.profileFormGroup.dirty;
  }

  protected async deleteAvatar(): Promise<void> {
    const avatarUrl = this.profile()?.avatar_url;

    if (this.#isLoading || !avatarUrl) {
      return;
    }

    this.#isLoading = true;

    this.profileFormGroup.disable();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      const response = await this.#profileService.deleteAvatar(avatarUrl);

      if (response.error) {
        throw response.error;
      }

      const { data } = await this.#profileService.updateAndSelectProfile({ avatar_url: null });

      this.profile.set(data);

      this.#alertService.showAlert(translate('alerts.avatar-deleted'));
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.profileFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }

  protected async replaceAvatar(event: Event): Promise<void> {
    const avatarFileInput = event.target;

    if (!(avatarFileInput instanceof HTMLInputElement)) {
      return;
    }

    const files: FileList | null = avatarFileInput.files;

    if (files?.length !== 1) {
      avatarFileInput.value = '';
      return;
    }

    const file: File | undefined = files[0];

    if (!file?.type.startsWith('image/')) {
      this.#alertService.showAlert(translate('alerts.avatar-error-invalid'));

      avatarFileInput.value = '';
      return;
    }

    const maxFileSizeMb = 1;

    if (file.size > maxFileSizeMb * 1024 * 1024) {
      this.#alertService.showAlert(translate('alerts.avatar-error-size-x', { x: maxFileSizeMb }));

      avatarFileInput.value = '';
      return;
    }

    if (this.#isLoading) {
      avatarFileInput.value = '';
      return;
    }

    this.#isLoading = true;

    this.profileFormGroup.disable();

    this.#progressBarService.showIndeterminateProgressBar();

    try {
      let response;

      let avatarUrl = this.profile()?.avatar_url;

      if (avatarUrl) {
        response = await this.#profileService.deleteAvatar(avatarUrl);

        if (response.error) {
          throw response.error;
        }
      }

      response = await this.#profileService.uploadAvatar(file);

      if (response.error) {
        throw response.error;
      }

      avatarUrl = this.#profileService.getAvatarPublicUrl(response.data.path);

      const { data } = await this.#profileService.updateAndSelectProfile({ avatar_url: avatarUrl });

      this.profile.set(data);

      this.#alertService.showAlert(translate('alerts.avatar-updated'));
    } catch (exception: unknown) {
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      avatarFileInput.value = '';
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
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
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
      this.#loggerService.logException(exception);
      this.#alertService.showExceptionAlert(exception);
    } finally {
      this.#isLoading = false;
      this.profileFormGroup.enable();
      this.#progressBarService.hideProgressBar();
    }
  }
}
