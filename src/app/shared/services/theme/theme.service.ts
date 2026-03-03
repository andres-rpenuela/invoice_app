import { Injectable, signal, WritableSignal, effect } from '@angular/core';
import { THEME } from '../types/theme.type';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _currentTheme: WritableSignal<THEME>;

  constructor() {

    // leer de localStorage y si es null usar 'winter'
    const stored = localStorage.getItem('theme') as THEME | null;
    this._currentTheme = signal<THEME>(stored ?? 'winter');

    // efecto para sincronizar DOM y localStorage
    effect(() => {
      console.log('Theme changed to:', this._currentTheme());
      const current = this._currentTheme();
      document.body.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
    });
  }

  get currentTheme(): THEME {
    return this._currentTheme();
  }

  toggleTheme() {
    this._currentTheme.update((value) => (value === 'winter' ? 'night' : 'winter'));
  }
}
