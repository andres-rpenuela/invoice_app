import { Component, effect, linkedSignal, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite'
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('angular-app');
  // Inicializa desde localStorage si existe
  theme = signal<string>(localStorage.getItem('theme') || 'winter');

  constructor(){
    // Cada vez que cambie la señal, actualiza el body y localStorage
    effect( () =>{
      const current = this.theme();
      document.body.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
    })
  }


  ngOnInit(): void {
    initFlowbite();
  }

  toggleTheme() {
    // Cambia entre winter y night
    this.theme.update( value => value === 'winter' ? 'night' : 'winter');

  }
}
