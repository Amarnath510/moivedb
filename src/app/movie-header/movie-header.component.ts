import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-movie-header',
  templateUrl: './movie-header.component.html',
  styleUrls: ['./movie-header.component.scss']
})
export class MovieHeaderComponent implements OnInit {

  readonly themes = ['White', 'Sky'];

  @Output()
  updateTheme: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  changeTheme(theme): void {
    this.updateTheme.emit(theme);
  }

}
