import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  InputSignal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoggerService } from '@jet/services/logger/logger.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule],
  selector: 'jet-skeleton-card',
  styleUrl: './skeleton-card.component.scss',
  templateUrl: './skeleton-card.component.html',
})
export class SkeletonCardComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly height: InputSignal<number> = input.required();
  public readonly width: InputSignal<number> = input.required();

  public constructor() {
    this.#loggerService.logComponentInitialization('SkeletonCardComponent');
  }
}
