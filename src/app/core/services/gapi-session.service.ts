import { Injectable } from "@angular/core";
import { Observable, from } from "rxjs";
import { AppRepositoryService } from "./app-repository.service";

const CLIENT_ID =
  "81838757196-k27ooqhtctsqlctlj0h2tp3l8patpbhh.apps.googleusercontent.com";
const API_KEY = "AIzaSyDUej4TFbemSbvvMbsqTg9yH8N2VtW_I4k";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"
];
const SCOPES = "https://www.googleapis.com/auth/drive";

@Injectable({
  providedIn: 'root'
})
export class GapiSession {
  googleAuth: gapi.auth2.GoogleAuth | undefined;

  constructor(private appRepository: AppRepositoryService) {}

  initClient(): Observable<void> {
    return new Observable<void>((observer) => {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          });
          this.googleAuth = gapi.auth2.getAuthInstance();
          observer.next(); // Emit success
          observer.complete(); // Complete the Observable
        } catch (error) {
          observer.error(error); // Emit error
        }
      });
    });
  }

  signIn(): Observable<gapi.auth2.GoogleUser> {
    return new Observable<gapi.auth2.GoogleUser>((observer) => {
      if (!this.googleAuth) {
        observer.error(new Error("Google Auth instance is not initialized."));
        return;
      }
      this.googleAuth.signIn({ prompt: "consent" }).then(
        (googleUser) => {
          this.appRepository.User.add(googleUser.getBasicProfile());
          observer.next(googleUser); // Emit the signed-in user
          observer.complete(); // Complete the Observable
        },
        (error) => observer.error(error) // Emit error on failure
      );
    });
  }
}
