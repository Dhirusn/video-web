import { isPlatformBrowser } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { GoogleDriveServiceService } from '../../core/services/google-drive-service.service';
import { Observable } from 'rxjs';
import { FileService } from '../../core/services/file.service';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {

  file$: Observable<any[]> | undefined;



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

  folders: any[] = [];
  videos: any[] = [];


  constructor(private googleDriveService: GoogleDriveServiceService, private fileService: FileService) { }

  ngOnInit(): void {
    this.fileService.getImages().subscribe(
      value => console.log(value)
    )
    this.googleDriveService.initializeClient().subscribe({
      next: () => {
        this.googleDriveService.getAllFolders().subscribe({
          next: (folders) => {
            this.folders = folders;

            if (folders.length > 0) {
              const firstFolderId = folders[0].id; // Fetch the first folder's ID
              this.googleDriveService.getFolderFiles(firstFolderId).subscribe({
                next: (files) => {
                  this.videos = files;
                  console.log(this.videos);
                },
                error: (err) =>
                  console.error('Error fetching files from folder:', err),
              });
            }
          },
          error: (err) =>
            console.error('Error fetching folder list:', err),
        });
      },
      error: (err) =>
        console.error('Error initializing Google API client:', err),
    });
  }
  platformId(platformId: any) {
    throw new Error('Method not implemented.');
  }
}
