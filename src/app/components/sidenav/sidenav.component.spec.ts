import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideRouter } from '@angular/router';
import { BadgeContentService } from '@jet/services/badge-content/badge-content.service';
import { BadgeContentServiceMock } from '@jet/services/badge-content/badge-content.service.mock';
import { LoggerService } from '@jet/services/logger/logger.service';
import { LoggerServiceMock } from '@jet/services/logger/logger.service.mock';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconTestingModule,
        TranslocoTestingModule.forRoot({ langs: { en: {} } }),
        SidenavComponent,
      ],
      providers: [
        provideRouter([]),
        { provide: BadgeContentService, useClass: BadgeContentServiceMock },
        { provide: LoggerService, useClass: LoggerServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('activeNavItemPath', undefined);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
