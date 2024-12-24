import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IImageSource,IImageInfo, IImgurResponse, IImgurResponseData } from './image.interface';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileService {

  private images: IImageInfo[] = [];
  private otherUrl = 'https://www.googleapis.com/drive/v2/files/1NQ4l_Q97AL1idYj549Y0Oei11CMohmaj/children';

  private url = 'https://www.googleapis.com/drive/v3/files/1eroE5IShUxTP6ZALNOxgB0ziTEt4boT8';
// 1S4Qk4Bb4g8KjJWlu4j_DSvqK2lkhYY-R


  // private otherUrl = 'https://api.imgur.com/3/image/bYBKcgs';

  private otherClientId = 'AIzaSyDUej4TFbemSbvvMbsqTg9yH8N2VtW_I4k';
  private otherClientSecret = 'fFVqzr7_G4YjXY8FxICSVj6E';

  private clientId = '762224433813-k9kq2nengkgrji4rm4vatr0tk6kln784.apps.googleusercontent.com';

  private accessToken = 'ya29.Il_ABw4xfF3GfA2HAOXXz3QVLA_Ws55nnQPs8c0oTeBUrfjgH2_ui8bfx9Xg8yFhk2xVslgwp4YbMqrfiD_3MW1a6VEH0xzPszUBa23xQevlyrBK-TGAIzvSqesTSWUrLw';
  private refreshToken = '95ec846d8b45f2979c62eedf51ea689451669a8a';
  private headersAccess = new HttpHeaders({
    'Authorization': `Bearer ${this.accessToken}`
  });
  private headersRefresh = new HttpHeaders({
    'Authorization': `Bearer ${this.refreshToken}`
  });
  imageLink: string;
  constructor(
    private http: HttpClient
  ) { }

  uploadImage(imageSource: IImageSource): Observable<any> {
    const formData = new FormData();
    formData.append('image', imageSource.file, imageSource.title);

    return this.http.post(`${this.url}/add`, formData, { headers: this.headersAccess }).pipe(
      tap((imageData: IImgurResponse) => {
        this.imageLink = imageData['data'].link;
        console.log(imageData);
        this.images.unshift({
          title: imageSource.title,
          description: imageSource.description,
          link: this.imageLink
        } as IImageInfo);
        console.log(this.images);
      })
    );
  }

  getImages(): Observable<any> {
    return this.http.get<any>(`${this.url}`, { headers: this.headersAccess }).pipe(
      tap(_ => console.log('en', _))
    );
  }
}