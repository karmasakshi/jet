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
  selector: 'jet-empty-card',
  styleUrl: './empty-card.component.scss',
  templateUrl: './empty-card.component.html',
})
export class EmptyCardComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly height: InputSignal<number> = input.required();
  public readonly message: InputSignal<string> = input.required();

  public constructor() {
    this.#loggerService.logComponentInitialization('EmptyCardComponent');
  }
}
