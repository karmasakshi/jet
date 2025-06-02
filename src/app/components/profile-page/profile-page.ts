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
import { Analytics } from '@jet/directives/analytics/analytics';
import { Profile } from '@jet/interfaces/profile.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProfileService } from '@jet/services/profile/profile.service';
import { ProgressBarService } from '@jet/services/progress-bar/progress-bar.service';
import { UserService } from '@jet/services/user/user.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { User } from '@supabase/supabase-js';
import { Page } from '../page/page';

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
    Analytics,
    TranslocoModule,
    Page,
  ],
  selector: 'jet-profile-page',
  styleUrl: './profile-page.scss',
  templateUrl: './profile-page.html',
})
export class ProfilePage implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _alertService = inject(AlertService);
  private readonly _loggerService = inject(LoggerService);
  private readonly _profileService = inject(ProfileService);
  private readonly _progressBarService = inject(ProgressBarService);
  private readonly _userService = inject(UserService);
  private readonly _translocoService = inject(TranslocoService);

  private readonly _avatarFileInput: Signal<
    undefined | ElementRef<HTMLInputElement>
  > = viewChild<ElementRef<HTMLInputElement>>('avatarFileInput');

  private _isLoading: boolean;

  public profile: null | Profile;
  public readonly profileFormGroup: FormGroup<{
    username: FormControl<null | string>;
  }>;
  public readonly user: null | User;

  public constructor() {
    this._isLoading = false;

    this.profile = null;

    this.profileFormGroup = this._formBuilder.group({
      username: this._formBuilder.control<null | string>(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36),
        Validators.pattern(/^[a-z0-9_]+$/),
      ]),
    });

    this.user = this._userService.user();

    this._loggerService.logComponentInitialization('ProfilePage');
  }

  public ngOnInit(): void {
    void this._selectProfile();
  }

  public async replaceAvatar(): Promise<void> {
    const files: undefined | null | FileList =
      this._avatarFileInput()?.nativeElement.files;

    if (files?.length !== 1) {
      return;
    }

    const file: undefined | File = files[0];

    if (!file?.type.startsWith('image/')) {
      this._alertService.showAlert(
        this._translocoService.translate('alerts.please-select-a-valid-avatar'),
      );

      return;
    }

    if (file.size > AVATAR_FILE_MAX_SIZE) {
      this._alertService.showAlert(
        this._translocoService.translate(
          'alerts.please-select-a-smaller-avatar',
          { value: AVATAR_FILE_MAX_SIZE / (1024 * 1024) },
        ),
      );

      return;
    }

    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.profileFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      let response;

      response = await this._profileService.deleteAvatar(
        this.profile?.avatar_url ?? '',
      );

      if (response.error) {
        throw response.error;
      }

      response = await this._profileService.uploadAvatar(file);

      if (response.error) {
        throw response.error;
      }

      const avatarUrl: string = this._profileService.getAvatarPublicUrl(
        response.data.path,
      );

      await this._profileService.updateProfile({ avatar_url: avatarUrl });

      if (this.profile) {
        this.profile.avatar_url = avatarUrl;
      }

      this._alertService.showAlert(
        this._translocoService.translate('alerts.avatar-updated'),
      );
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.profileFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  public async updateProfile(partialProfile: Partial<Profile>): Promise<void> {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.profileFormGroup.disable();
    this._progressBarService.showProgressBar();

    try {
      await this._profileService.updateProfile(partialProfile);

      this._alertService.showAlert(
        this._translocoService.translate('alerts.profile-updated'),
      );
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.profileFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }

  private async _selectProfile(): Promise<void> {
    if (this._isLoading) {
      return;
    }

    this._isLoading = true;
    this.profileFormGroup.disable();
    this._progressBarService.showProgressBar({ mode: 'query' });

    try {
      const { data } = await this._profileService.selectProfile();

      this.profile = data;

      this.profileFormGroup.patchValue({ username: data.username });
    } catch (exception: unknown) {
      if (exception instanceof Error) {
        this._loggerService.logError(exception);
        this._alertService.showErrorAlert(exception.message);
      } else {
        this._loggerService.logException(exception);
      }
    } finally {
      this._isLoading = false;
      this.profileFormGroup.enable();
      this._progressBarService.hideProgressBar();
    }
  }
}
