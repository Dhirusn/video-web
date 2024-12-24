import { Component, ElementRef, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'] // Fixed typo in styleUrls
})
export class HeaderComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object // Inject platform ID for SSR checks
  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Attach scroll and load event listeners
      window.addEventListener('scroll', this.toggleScrolled.bind(this));
      window.addEventListener('load', this.toggleScrolled.bind(this));

      // Mobile nav toggle
      const mobileNavToggleBtn = this.el.nativeElement.querySelector('.mobile-nav-toggle');
      if (mobileNavToggleBtn) {
        this.renderer.listen(mobileNavToggleBtn, 'click', this.mobileNavToggle.bind(this));
      }

      // Handle nav menu clicks
      const navMenuLinks = this.el.nativeElement.querySelectorAll('#navmenu a');
      navMenuLinks.forEach((link: HTMLElement) => {
        this.renderer.listen(link, 'click', () => {
          if (this.el.nativeElement.querySelector('.mobile-nav-active')) {
            this.mobileNavToggle();
          }
        });
      });

      // Handle nav dropdown toggles
      const dropdownToggles = this.el.nativeElement.querySelectorAll('.navmenu .toggle-dropdown');
      dropdownToggles.forEach((toggle: HTMLElement) => {
        this.renderer.listen(toggle, 'click', (event: Event) => {
          event.preventDefault();
          const parent = toggle.parentElement;
          const sibling = parent?.nextElementSibling as HTMLElement;

          if (parent && sibling) {
            this.toggleClass(parent, 'active');
            this.toggleClass(sibling, 'dropdown-active');
          }
          event.stopImmediatePropagation();
        });
      });
    }
  }

  toggleScrolled(): void {
    if (isPlatformBrowser(this.platformId)) {
      const body = this.el.nativeElement.querySelector('body');
      const header = this.el.nativeElement.querySelector('#header');

      if (
        header &&
        (header.classList.contains('scroll-up-sticky') ||
          header.classList.contains('sticky-top') ||
          header.classList.contains('fixed-top'))
      ) {
        if (window.scrollY > 100) {
          this.renderer.addClass(body, 'scrolled');
        } else {
          this.renderer.removeClass(body, 'scrolled');
        }
      }
    }
  }

  mobileNavToggle(): void {
    if (isPlatformBrowser(this.platformId)) {
      const body = this.el.nativeElement.querySelector('body');
      const mobileNavToggleBtn = this.el.nativeElement.querySelector('.mobile-nav-toggle');

      if (body && mobileNavToggleBtn) {
        if (body.classList.contains('mobile-nav-active')) {
          this.renderer.removeClass(body, 'mobile-nav-active');
        } else {
          this.renderer.addClass(body, 'mobile-nav-active');
        }

        if (mobileNavToggleBtn.classList.contains('bi-list')) {
          this.renderer.removeClass(mobileNavToggleBtn, 'bi-list');
          this.renderer.addClass(mobileNavToggleBtn, 'bi-x');
        } else {
          this.renderer.removeClass(mobileNavToggleBtn, 'bi-x');
          this.renderer.addClass(mobileNavToggleBtn, 'bi-list');
        }
      }
    }
  }

  private toggleClass(element: HTMLElement, className: string): void {
    if (element.classList.contains(className)) {
      this.renderer.removeClass(element, className);
    } else {
      this.renderer.addClass(element, className);
    }
  }
}
