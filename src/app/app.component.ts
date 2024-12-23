import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { LayoutModule } from './layout/layout.module';
import * as AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PagesModule, LayoutModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  title = 'video-web';
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Ensure AOS is initialized only in the browser
    if (isPlatformBrowser(this.platformId)) {
      AOS.init();
    }
  }
}
