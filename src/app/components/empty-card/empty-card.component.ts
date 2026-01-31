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
  selector: 'jet-empty-card',
  styleUrl: './empty-card.component.scss',
  templateUrl: './empty-card.component.html',
})
export class EmptyCardComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly height = input.required<number>();
  public readonly message = input.required<string>();
  public readonly width = input.required<number>();

  public constructor() {
    this.#loggerService.logComponentInitialization('EmptyCardComponent');
  }
}
