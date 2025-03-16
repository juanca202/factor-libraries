import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleTagManagerService {
  trackingId!: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router
  ) {}

  public appendTrackingCode(
    trackingId: string,
    options?: { environment?: { auth: string; preview: string } }
  ): void {
    try {
      if (isPlatformBrowser(this.platformId) && trackingId) {
        this.trackingId = trackingId;
        const s1: HTMLElement = document.createElement('script');
        s1.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'',p='${
            options?.environment?.preview
              ? '&gtm_auth=' + options?.environment.auth + '&gtm_preview=' + options?.environment.preview
              : ''
          }';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl+p;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${trackingId}');
        `;
        document.head.appendChild(s1);
        const s2: HTMLElement = document.createElement('noscript');
        const s3: HTMLIFrameElement = document.createElement('iframe');
        s3.width = '0';
        s3.height = '0';
        s3.style.display = 'none';
        s3.style.visibility = 'hidden';
        s3.src = `//www.googletagmanager.com/ns.html?id=${trackingId}`;
        s2.appendChild(s3);
        (document.body as HTMLElement).prepend(s2);
        this.initSubscribers();
      }
    } catch (ex) {
      console.error('Error appending google tag manager');
      console.error(ex);
    }
  }
  public addVariable(variable: any) {
    if (isPlatformBrowser(this.platformId) && this.trackingId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(variable);
    }
  }
  private initSubscribers() {
    this.router.events.subscribe(event => {
      try {
        if (event instanceof NavigationEnd && this.trackingId) {
          this.addVariable({
            event: 'router.NavigationEnd',
            pageTitle: document.title,
            pagePath: event.urlAfterRedirects
          });
        }
      } catch (e) {
        console.error(e);
      }
    });
  }
}
