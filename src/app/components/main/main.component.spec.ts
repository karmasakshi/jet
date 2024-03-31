import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { getTranslocoModule } from '@xxx/modules/transloco-testing.module';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: false,
        }),
        getTranslocoModule(),
        MainComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
