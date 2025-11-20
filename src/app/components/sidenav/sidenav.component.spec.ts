import { ComponentRef, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { ActivatedRoute } from '@angular/router';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let componentRef: ComponentRef<SidenavComponent>;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconTestingModule,
        TranslocoTestingModule.forRoot({ langs: { en: {} } }),
        SidenavComponent,
      ],
      providers: [
        provideZonelessChangeDetection(),
        { provide: ActivatedRoute, useValue: {} },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('activeNavigationMenuItemPath', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
