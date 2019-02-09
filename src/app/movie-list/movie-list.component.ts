import { Component, OnInit } from '@angular/core';
import { MovieService } from '../movie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss']
})
export class MovieListComponent implements OnInit {

  readonly MAX_SIZE: number = 10;
  readonly DEFAULT_SORT = 'name';

  readonly SORT_BY_OPTIONS = [
    { key: 'name', label: 'Movie Name'},
    { key: 'language', label: 'Language'},
    { key: 'country', label: 'Country'},
    { key: 'title_year', label: 'Year'},
    { key: 'budget', label: 'Budget'}
  ];

  totalMovies: number = 0;
  page: number = 1;
  query: string;
  movieToDisplay: any[] = [];
  activeSort: string = 'name';
  response: any = [];
  searchChanged: Subject<string> = new Subject<string>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {
    this.searchChanged
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(inputQuery => {
        this.query = inputQuery;
        this.page = 1;
        this.activeSort = this.DEFAULT_SORT;
        this.loadMovies();
      });
  }

  ngOnInit() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    this.page = queryParams['page'] || 1;
    this.activeSort = queryParams['sort'] || this.DEFAULT_SORT;
    this.loadMovies();
  }

  private loadMovies(): void {
    this.movieService
    .fetchMovies()
    .subscribe(response => {
      this.response = response;
      this.refreshView();
    });
  }

  private refreshView(): void {
    this.refreshUrl();
    this.refreshData();
  }

  private refreshUrl(): void {
    const url = this.router.url.split('?')[0];
    this.router.navigate([url], { queryParams: { page: this.page, sort: this.activeSort, query: this.query } });
  }

  private refreshData() {
    const results = this.filterResponse(this.response);
    this.totalMovies = results.length;
    if (results.length) {
      this.doPaginationAndPopulateDisplay(results, this.page);
    } else {
      this.movieToDisplay = [];
    }
  }

  private doPaginationAndPopulateDisplay(results, currPage = 1): void {
    const from: number = (currPage - 1) * this.MAX_SIZE;
    let to: number;
    if (currPage * this.MAX_SIZE < results.length) {
      to = currPage * this.MAX_SIZE;
    } else {
      to = results.length - 1;
    }

    this.movieToDisplay = results.length > this.MAX_SIZE ? results.slice(from, to) : results;
  }

  private filterResponse(resp: any[]): any[] {
    let results = [];
    if (this.query) {
      results = this.searchInResponse(resp, this.query);
      if (results.length) {
        results = this.sortMovies(results, this.activeSort);
      }
    } else {
      results = this.sortMovies(resp, this.activeSort);
    }

    return results;
  }

  private sortMovies(resp: any[], sort: string): any[] {
    return resp.sort(function(m1, m2) {
      if (sort) {
        const movieProp1 = m1[sort];
        const movieProp2 = m2[sort];
        if (!movieProp1) {
          return 1;
        } else if (!movieProp2) {
          return -1;
        } else {
          return movieProp1 - movieProp2;
        }
      } else {
        return m1.movie_title - m2.movie_title;
      }
    });
  }

  private searchInResponse(resp: any[], search): any[] {
    const results = [];
    for (let i = 0; i < resp.length; i++) {
      const movie = resp[i];
      const title: string = movie.movie_title ? movie.movie_title.toLowerCase() : '';
      const language: string = movie.language ? movie.language.toLowerCase() : '';
      const actor1: string = movie.actor_1_name ? movie.actor_1_name.toLowerCase() : '';
      const actor2: string = movie.actor_2_name ? movie.actor_2_name.toLowerCase() : '';
      if (title.includes(search)
        || language.includes(search)
        || actor1.includes(search)
        || actor2.includes(search)) {
        results.push(movie);
      }
    }
    return results;
  }

  pageChanged(newPage): void {
    this.page = newPage;
    this.loadMovies();
  }

  searchMovies(inputQuery): void {
    this.searchChanged.next(inputQuery);
  }

  isSortActive(sort) {
    return this.activeSort === sort;
  }

  sortBy(sort) {
    this.activeSort = sort;
    this.page = 1;
    this.loadMovies();
  }

  getGenres(genres: string): string {
    const genresToDisplay: string[] = genres && genres.split('|');
    return genresToDisplay.join(', ');
  }
}
