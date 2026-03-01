import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme/theme.service';
import {App} from './app';

describe('App Component', () => {
  let fixture: ComponentFixture<App>;
  let component: App;
  let themeService: ThemeService;

  beforeEach(async () => {
    localStorage.clear(); // limpiar localStorage antes de crear el servicio

    await TestBed.configureTestingModule({
      imports: [RouterOutlet, App],
      providers: [ThemeService]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    themeService = TestBed.inject(ThemeService);

    fixture.detectChanges(); // dispara ngOnInit y efectos
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should return the title', () => {
    expect(component.getTitle()).toBe('angular-app');
  });

  it('should toggle theme using ThemeService', async () => {
    const initialTheme = themeService.currentTheme;

    await Promise.resolve();   // esperar que el effect se ejecute

    expect(themeService.currentTheme).toBe(initialTheme);
    expect(localStorage.getItem('theme')).toBe(initialTheme);
  });

  it('should update document.body data-theme on toggle', () => {
    const initial = themeService.currentTheme;

    component.toggleTheme();
    fixture.detectChanges(); // dispara todos los effects y ciclo de Angular

    expect(document.body.getAttribute('data-theme')).toBe(themeService.currentTheme);
    expect(document.body.getAttribute('data-theme')).not.toBe(initial);
  });
});
