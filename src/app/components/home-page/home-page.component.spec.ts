import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePageComponent } from './home-page.component';
import { getTranslocoModule } from '@xxx/modules/transloco-testing.module';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule(), HomePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
