import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

declare var gapi: any; // Declaring gapi globally for Google API

@Injectable({
  providedIn: 'root'
})
export class GoogleDriveService {
  private clientId = '75577213108-lmi32kcqgeh3a7ds2pode40v4ufk7alk.apps.googleusercontent.com';
  private apiKey = 'YOUR_API_KEY'; // You may need to get an API Key from Google Console
  private refreshToken = '1//04y1bcNQc2DwTCgYIARAAGAQSNwF-L9IrdLRJ6_foDbUyEsb9f0YDmw9AWytg8K7K7Dep5n5nU6Etd20fHK_3TZ95LMqnel9WVQc';
  private folderId: string = 'YOUR_FOLDER_ID';

  constructor() { }

  // Initialize Google API client
  private initializeClient(): Observable<any> {
    return new Observable(observer => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: this.apiKey,
          clientId: this.clientId,
          discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
          scope: 'https://www.googleapis.com/auth/drive.readonly'
        }).then(() => {
          observer.next('Google API initialized');
          observer.complete();
        }, (error: any) => {
          observer.error(error);
        });
      });
    });
  }

  // Authenticate user using Google OAuth 2.0
  authenticate(): Observable<any> {
    return new Observable(observer => {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        observer.next('User signed in');
        observer.complete();
      }, (error: any) => {
        observer.error(error);
      });
    });
  }

  // Fetch files from the folder
  getFolderFiles(): Observable<any> {
    return new Observable(observer => {
      gapi.client.drive.files.list({
        q: `'${this.folderId}' in parents and mimeType contains 'video/'`,
        fields: "files(id, name, mimeType, webViewLink, webContentLink)"
      }).then((response: any) => {
        observer.next(response.result.files);
        observer.complete();
      }, (error: any) => {
        observer.error(error);
      });
    });
  }

  // Fetch all video files (e.g., mp4) from Google Drive
  getAllVideoFiles(): Observable<any> {
    return new Observable(observer => {
      gapi.client.drive.files.list({
        q: "mimeType='video/mp4'",  // Specify video format
        fields: "files(id, name, webContentLink)"
      }).then((response: any) => {
        observer.next(response.result.files);
        observer.complete();
      }, (error: any) => {
        observer.error(error);
      });
    });
  }

  // Fetch all folders in Google Drive
  getAllFolders(): Observable<any> {
    return new Observable(observer => {
      gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder'",  // Filter only folders
        fields: "files(id, name)"
      }).then((response: any) => {
        observer.next(response.result.files);
        observer.complete();
      }, (error: any) => {
        observer.error(error);
      });
    });
  }
}
