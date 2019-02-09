import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';


@Injectable()
export class MovieService {

  private MOVIES_LINK = '/api/movies';

  constructor(
    private http: HttpClient
  ) { }

  fetchMovies(): Observable<any> {
    return this.http.get(this.MOVIES_LINK);
  }

}
