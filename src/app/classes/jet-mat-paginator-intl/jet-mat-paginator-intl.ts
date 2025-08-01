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

  public constructor() {
    this.changes = new Subject<void>();

    this.#loggerService.logClassInitialization('JetMatPaginatorIntl');
  }

  public get firstPageLabel(): string {
    return this.#translocoService.translate('paginator.first-page');
  }

  public get itemsPerPageLabel(): string {
    return this.#translocoService.translate('paginator.items-per-page');
  }

  public get lastPageLabel(): string {
    return this.#translocoService.translate('paginator.last-page');
  }

  public get nextPageLabel(): string {
    return this.#translocoService.translate('paginator.next-page');
  }

  public get previousPageLabel(): string {
    return this.#translocoService.translate('paginator.previous-page');
  }

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    if (!length) {
      return this.#translocoService.translate('paginator.page-1-of-1');
    }

    const pages = Math.ceil(length / pageSize);

    return this.#translocoService.translate('paginator.page', {
      active: page + 1,
      total: pages,
    });
  }
}
