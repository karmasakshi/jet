import { Component, inject, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoggerService } from '@jet/services/logger/logger.service';

@Component({
  imports: [MatPaginatorModule],
  selector: 'jet-table',
  styles: ``,
  templateUrl: './table.component.html',
})
export class TableComponent {
  readonly #loggerService = inject(LoggerService);

  public readonly pageChange = output<PageEvent>();

  public readonly length = input.required<number>();
  public readonly isLoading = input.required<boolean>();
  public readonly pageIndex = input.required<number>();
  public readonly pageSize = input.required<number>();

  public constructor() {
    this.#loggerService.logComponentInitialization('TableComponent');
  }
}
