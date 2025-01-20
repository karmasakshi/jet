import { DatePipe, NgOptimizedImage, NgStyle } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  Signal,
  untracked,
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
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
  imports: [
    NgStyle,
    DatePipe,
    NgOptimizedImage,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatRippleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterLink,
    TranslocoModule,
    PageComponent,
  ],
  selector: 'jet-profile-page',
  styleUrl: './profile-page.component.scss',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _profileService = inject(ProfileService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private readonly _avatarInput =
    viewChild.required<ElementRef<HTMLInputElement>>('avatarInput');

  public isUpdateProfilePending: boolean;
  public readonly profile: Signal<Profile | null>;
  public readonly profileFormGroup: FormGroup<{
    username: FormControl<string | null>;
  }>;
  public readonly user: Signal<User | null>;

  public constructor() {
    this.isUpdateProfilePending = false;

    this.profile = this._profileService.profile;

    this.profileFormGroup = this._formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          Validators.pattern(/^[a-z0-9_]+$/),
        ],
      ],
    });

    this.user = this._userService.user;

    effect(() => {
      const profile: Profile | null = this.profile();
      untracked(() => {
        if (profile) {
          this.profileFormGroup.controls.username.patchValue(profile.username);
        }
      });
    });

    this._loggerService.logComponentInitialization('ProfilePageComponent');
  }

  public async replaceAvatar(): Promise<void> {
    const files = this._avatarInput().nativeElement.files;

    if (!files || files.length !== 1) {
      return;
    }

    const file = files[0];

    if (!file?.type.startsWith('image/')) {
      this._alertService.showAlert(
        this._translocoService.translate('alerts.please-choose-a-valid-image'),
      );
      return;
    }

    if (!(file?.size <= 1024 * 1024)) {
      this._alertService.showAlert(
        this._translocoService.translate(
          'alerts.please-choose-a-smaller-image',
        ),
      );
      return;
    }

    if (this.isUpdateProfilePending) {
      return;
    }

    this.isUpdateProfilePending = true;
    this.profileFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      let response;

      response = await this._profileService.deleteAvatar(
        this.profile()?.avatar_url ?? '',
      );

      if (response.error) {
        throw response.error;
      }

      response = await this._profileService.uploadAvatar(file);

      if (response.error) {
        throw response.error;
      }

      await this._profileService.updateProfile({
        avatar_url: this._profileService.getAvatarPublicUrl(
          response.data?.path ?? '',
        ),
      });

      this._alertService.showAlert(
        this._translocoService.translate('alerts.avatar-updated'),
      );

      await this._profileService.selectProfile();
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this.isUpdateProfilePending = false;
      this.profileFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  public async updateProfile(partialProfile: Partial<Profile>): Promise<void> {
    if (this.isUpdateProfilePending) {
      return;
    }

    this.isUpdateProfilePending = true;
    this.profileFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      await this._profileService.updateProfile(partialProfile);

      this._alertService.showAlert(
        this._translocoService.translate('alerts.profile-updated-successfully'),
      );

      void this._profileService.selectProfile();
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this.isUpdateProfilePending = false;
      this.profileFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }
}
