import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {

      new Swiper('.swiper-container', {
        modules: [Navigation, Pagination],
        navigation: true,
        pagination: { clickable: true },
        spaceBetween: 10,
        slidesPerView: 3,
        breakpoints: {
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }


  }
  platformId(platformId: any) {
    throw new Error('Method not implemented.');
  }
}
