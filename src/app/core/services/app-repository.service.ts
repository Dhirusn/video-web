import { Injectable } from '@angular/core';
import { FileRepository } from './file-repository.service';
import { UserRepository } from './user-repository.service';

@Injectable({
  providedIn: 'root'
})
export class AppRepositoryService {

  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository
  ) { }
  get File(): FileRepository {
    return this.fileRepository;
  }
  get User(): UserRepository {
    return this.userRepository;
  }
}
