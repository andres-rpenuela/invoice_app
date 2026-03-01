import {Component, inject, linkedSignal, OnInit, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite'
import {ThemeService} from './shared/services/theme/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('angular-app');

  public themeService = inject(ThemeService);
  private _theme = linkedSignal( () => this.themeService.currentTheme );

  ngOnInit(): void {
    initFlowbite();
  }

  getTitle() {
    return this.title();
  }


  toggleTheme() {
    this.themeService.toggleTheme()
  }

  get theme() {
    return this._theme();
  }
}
