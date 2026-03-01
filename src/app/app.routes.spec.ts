import { TestBed, ComponentFixture } from '@angular/core/testing';
import {Router, RouterModule} from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';

// Componentes standalone para test
@Component({ standalone: true, template: '<p>Home Page</p>' })
class HomeComponent {}

@Component({ standalone: true, template: '<p>About Page</p>' })
class AboutComponent {}

describe('App Routing', () => {
  let fixture: ComponentFixture<App>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        HomeComponent,
        AboutComponent,
        RouterModule.forRoot([
          { path: '', component: HomeComponent },
          { path: 'about', component: AboutComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should render HomeComponent on default route', async () => {
    await router.navigate(['']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('Home Page');
  });

  it('should render AboutComponent on /about route', async () => {
    await router.navigate(['about']);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p')?.textContent).toContain('About Page');
  });
});
