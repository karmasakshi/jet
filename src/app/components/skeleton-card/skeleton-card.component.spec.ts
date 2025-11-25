import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { SkeletonCardComponent } from './skeleton-card.component';

describe('SkeletonCardComponent', () => {
  let component: SkeletonCardComponent;
  let fixture: ComponentFixture<SkeletonCardComponent>;
  let componentRef: ComponentRef<SkeletonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonCardComponent],
      providers: [{ provide: LoggerService, useClass: LoggerServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('height', undefined);
    componentRef.setInput('width', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
