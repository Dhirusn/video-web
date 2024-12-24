import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveServiceService {
  private gapiLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  public loadGapi(): Observable<void> {
    return new Observable((observer) => {
      if (!isPlatformBrowser(this.platformId)) {
        observer.error('Google API can only be initialized in a browser environment');
        return;
      }

      if (this.gapiLoaded) {
        observer.next();
        observer.complete();
      } else {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          this.gapiLoaded = true;
          observer.next();
          observer.complete();
        };
        script.onerror = (error) => {
          observer.error('Failed to load Google API script');
        };
        document.body.appendChild(script);
      }
    });
  }

  initializeClient(): Observable<any> {
    return new Observable((observer) => {
      this.loadGapi().subscribe({
        next: () => {
          gapi.load('client:auth2', () => {
            gapi.client
              .init({
                apiKey: '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',
                clientId: '75577213108-lmi32kcqgeh3a7ds2pode40v4ufk7alk.apps.googleusercontent.com',
                clientSecret: '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',
                discoveryDocs: [
                  'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
                ],
                scope: 'https://www.googleapis.com/auth/drive.readonly',
              })
              .then(() => {
                observer.next('Google API initialized');
                observer.complete();
              })
              .catch((error: any) => {
                observer.error(error);
              });
          });
        },
        error: (err) => observer.error(err),
      });
    });
  }

  getAllFolders(): Observable<any[]> {
    return new Observable((observer) => {
      const request = gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",
        fields: 'files(id, name)',
      });

      request.execute((response: any) => {
        if (response.error) {
          observer.error(response.error);
        } else {
          observer.next(response.files || []);
          observer.complete();
        }
      });
    });
  }

  getFolderFiles(folderId: string): Observable<any[]> {
    return new Observable((observer) => {
      const request = gapi.client.drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'video/'`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
      });

      request.execute((response: any) => {
        if (response.error) {
          observer.error(response.error);
        } else {
          observer.next(response.files || []);
          observer.complete();
        }
      });
    });
  }
}
