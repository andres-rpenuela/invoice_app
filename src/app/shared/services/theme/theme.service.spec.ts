import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial theme from localStorage or default to "winter"', () => {
    const storedTheme = localStorage.getItem('theme');
    const expectedTheme = storedTheme ? storedTheme : 'winter';
    expect(service.currentTheme).toBe(expectedTheme);
  });

  it('should toggle theme between "winter" and "night"', () => {
    const initialTheme = service.currentTheme;
    service.toggleTheme();
    const toggledTheme = service.currentTheme;
    expect(toggledTheme).not.toBe(initialTheme);
    expect(['winter', 'night']).toContain(toggledTheme);
  });

});
