import { inject, Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LoggerService } from '@jet/services/logger/logger.service';
import { TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';

@Injectable()
export class JetMatPaginatorIntl implements MatPaginatorIntl {
  private readonly _loggerService = inject(LoggerService);
  private readonly _translocoService = inject(TranslocoService);

  public changes: Subject<void>;
  public firstPageLabel: string;
  public itemsPerPageLabel: string;
  public lastPageLabel: string;
  public nextPageLabel: string;
  public previousPageLabel: string;

  public constructor() {
    this.changes = new Subject<void>();

    this.firstPageLabel = this._translocoService.translate(
      'paginator.first-page',
    );

    this.itemsPerPageLabel = this._translocoService.translate(
      'paginator.items-per-page',
    );

    this.lastPageLabel = this._translocoService.translate(
      'paginator.last-page',
    );

    this.nextPageLabel = this._translocoService.translate(
      'paginator.next-page',
    );

    this.previousPageLabel = this._translocoService.translate(
      'paginator.previous-page',
    );

    this._loggerService.logClassInitialization('JetMatPaginatorIntl');
  }

  public getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return this._translocoService.translate('paginator.page-1-of-1');
    } else {
      const pages = Math.ceil(length / pageSize);
      return this._translocoService.translate('paginator.page', {
        active: page + 1,
        total: pages,
      });
    }
  }
}
