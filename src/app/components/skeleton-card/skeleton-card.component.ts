import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoggerService } from '@jet/services/logger/logger.service';

@Component({
  imports: [MatCardModule],
  selector: 'jet-skeleton-card',
  styles: `
    mat-card::after {
      animation: shimmer 1.2s ease-in-out infinite alternate;
      background: linear-gradient(180deg, transparent, rgb(255 255 255 / 6%), transparent);
      filter: blur(64px);
      mix-blend-mode: difference;
      transform: translateY(-100%);
    }

    @keyframes shimmer {
      to {
        transform: translateY(100%);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      mat-card::after {
        animation: none;
      }
    }
  `,
  templateUrl: './skeleton-card.component.html',
})
export class SkeletonCardComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly height = input.required<number>();
  public readonly width = input<number | undefined>(undefined);

  public constructor() {
    this.#loggerService.logComponentInitialization('SkeletonCardComponent');
  }
}
