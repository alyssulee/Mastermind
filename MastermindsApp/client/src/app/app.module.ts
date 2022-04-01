import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { RulesButtonComponent } from './rules-button/rules-button.component';
import { WordGridComponent } from './word-grid/word-grid.component';


@NgModule({
  declarations: [
    AppComponent,
    CreateGameComponent,
    JoinGameComponent,
    RulesButtonComponent,
    WordGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
