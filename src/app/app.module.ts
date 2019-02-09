import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MovieHeaderComponent } from './movie-header/movie-header.component';
import { MovieFooterComponent } from './movie-footer/movie-footer.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieService } from './movie-service';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'movies', component: MovieListComponent },
  { path: '**', redirectTo: '/movies', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    MovieHeaderComponent,
    MovieFooterComponent,
    MovieListComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ MovieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
