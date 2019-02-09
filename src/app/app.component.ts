import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sweeten-moviedb';
  currentTheme: string = 'White';

  constructor() {}

  updatedTheme(theme): void {
    this.currentTheme = theme;
  }

  isTheme(theme): boolean {
    return theme === this.currentTheme;
  }
}
