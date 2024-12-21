import { Component, inject, Signal } from '@angular/core';
import { Profile } from '@jet/interfaces/profile.interface';
import { LoggerService } from '@jet/services/logger/logger.service';
import { ProfileService } from '@jet/services/profile/profile.service';
import { TranslocoModule } from '@jsverse/transloco';
import { PageComponent } from '../page/page.component';

@Component({
  imports: [TranslocoModule, PageComponent],
  selector: 'jet-profile-page',
  styleUrl: './profile-page.component.scss',
  templateUrl: './profile-page.component.html',
})
export class ProfilePageComponent {
  private readonly _loggerService = inject(LoggerService);
  private readonly _profileService = inject(ProfileService);

  public profile: Signal<Profile | undefined>;

  public constructor() {
    this.profile = this._profileService.profile;

    this._loggerService.logComponentInitialization('ProfilePageComponent');
  }
}
