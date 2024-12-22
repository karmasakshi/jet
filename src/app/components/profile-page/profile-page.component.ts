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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Profile } from '@jet/interfaces/profile.interface';
import { AlertService } from '@jet/services/alert/alert.service';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProfileService } from '@jet/services/profile/profile.service';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [
    NgOptimizedImage,
    NgStyle,
    DatePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatRippleModule,
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
  private readonly _translocoService = inject(TranslocoService);

  private readonly _avatarInput =
    viewChild.required<ElementRef<HTMLInputElement>>('avatarInput');

  public isUpdateProfilePending: boolean;
  public profile: Signal<Profile | undefined>;
  public profileFormGroup: FormGroup<{
    username: FormControl<string | null>;
  }>;

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
          Validators.pattern(/^[a-zA-Z0-9_]{5,30}$/),
        ],
      ],
    });

    effect(() => {
      const profile: Profile | undefined = this.profile();
      untracked(() => {
        if (profile) {
          this.profileFormGroup.controls.username.setValue(profile.username);
        }
      });
    });

    this._loggerService.logComponentInitialization('ProfilePageComponent');
  }

  public updateProfile(partialProfile: Partial<Profile>): void {
    if (this.isUpdateProfilePending) {
      return;
    }

    this.isUpdateProfilePending = true;

    this.profileFormGroup.disable();

    this._profileService
      .updateProfile(partialProfile)
      // @ts-expect-error Supabase types unavailable
      .then(({ error }): void => {
        if (error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          const message: string = error.message;

          this._loggerService.logError(message);

          this._alertService.showErrorAlert(message);

          this.isUpdateProfilePending = false;

          this.profileFormGroup.enable();
        } else {
          this._profileService.selectProfile();

          this._alertService.showAlert(
            this._translocoService.translate(
              'alerts.profile-updated-successfully',
            ),
          );

          this.isUpdateProfilePending = false;

          this.profileFormGroup.enable();
        }
      });
  }

  public uploadAvatar(): void {
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

    this._profileService
      .uploadAvatar(file)
      .then(({ data, error }) => {
        if (error) {
          this._loggerService.logError(error);

          this._alertService.showErrorAlert(error.message);

          this.isUpdateProfilePending = false;

          this.profileFormGroup.enable();
        } else {
          if (data === null) {
            this._alertService.showErrorAlert();

            this.isUpdateProfilePending = false;

            this.profileFormGroup.enable();
          } else {
            this._alertService.showAlert(
              this._translocoService.translate(
                'alerts.upload-successful-saving-to-profile',
              ),
            );

            this.isUpdateProfilePending = false;

            this.updateProfile({
              avatar_url: this._profileService.getAvatarPublicUrl(data.path),
            });
          }
        }
      })
      .catch((error: Error) => {
        this._loggerService.logError(error);

        this._alertService.showErrorAlert(error.message);
      });
  }
}
