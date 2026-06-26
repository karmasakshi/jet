import { inject, Service } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LoggerService } from '@jet/services/logger/logger.service';
import { translate } from '@jsverse/transloco';
import { Subject } from 'rxjs';

@Service({ autoProvided: false })
export class JetMatPaginatorIntl implements MatPaginatorIntl {
  readonly #loggerService = inject(LoggerService);

  public readonly changes: Subject<void>;
  public readonly firstPageLabel: string;
  public readonly itemsPerPageLabel: string;
  public readonly lastPageLabel: string;
  public readonly nextPageLabel: string;
  public readonly previousPageLabel: string;

  public constructor() {
    this.changes = new Subject<void>();

    this.firstPageLabel = translate('paginator.first-page');

    this.itemsPerPageLabel = translate('paginator.items-per-page');

    this.lastPageLabel = translate('paginator.last-page');

    this.nextPageLabel = translate('paginator.next-page');

    this.previousPageLabel = translate('paginator.previous-page');

    this.#loggerService.logClassInitialization('JetMatPaginatorIntl');
  }

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    if (!length) {
      return translate('paginator.page-1-of-1');
    }

    const pages: number = Math.ceil(length / pageSize);

    return translate('paginator.page-x-of-y', { x: page + 1, y: pages });
  }
}
