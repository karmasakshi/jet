import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { getTranslocoModule } from '@xxx/modules/transloco-testing.module';
import { SettingsPageComponent } from './settings-page.component';

describe('SettingsPageComponent', () => {
  let component: SettingsPageComponent;
  let fixture: ComponentFixture<SettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: false,
        }),
        getTranslocoModule(),
        SettingsPageComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
