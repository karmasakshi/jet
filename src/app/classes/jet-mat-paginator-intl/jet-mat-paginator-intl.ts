import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';

@Injectable()
export class JetMatPaginatorIntl implements MatPaginatorIntl {
  readonly #loggerService = inject(LoggerService);
  readonly #translocoService = inject(TranslocoService);

  public readonly changes: Subject<void>;
  public readonly firstPageLabel: string;
  public readonly itemsPerPageLabel: string;
  public readonly lastPageLabel: string;
  public readonly nextPageLabel: string;
  public readonly previousPageLabel: string;

  public constructor() {
    this.changes = new Subject<void>();

    this.firstPageLabel = this.#translocoService.translate('paginator.first-page');

    this.itemsPerPageLabel = this.#translocoService.translate('paginator.items-per-page');

    this.lastPageLabel = this.#translocoService.translate('paginator.last-page');

    this.nextPageLabel = this.#translocoService.translate('paginator.next-page');

    this.previousPageLabel = this.#translocoService.translate('paginator.previous-page');

    this.#loggerService.logClassInitialization('JetMatPaginatorIntl');
  }

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    if (!length) {
      return this.#translocoService.translate('paginator.page-1-of-1');
    }

    const pages: number = Math.ceil(length / pageSize);

    return this.#translocoService.translate('paginator.page-x-of-y', { x: page + 1, y: pages });
  }
}
