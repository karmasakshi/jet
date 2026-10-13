import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TableComponent } from './table.component';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('count', undefined);
    fixture.componentRef.setInput('isLoading', undefined);
    fixture.componentRef.setInput('pageIndex', undefined);
    fixture.componentRef.setInput('pageSize', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
