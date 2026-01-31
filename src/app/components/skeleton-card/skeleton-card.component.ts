import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
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

  public readonly height = input.required<number>();
  public readonly width = input.required<number>();

  public constructor() {
    this.#loggerService.logComponentInitialization('SkeletonCardComponent');
  }
}
