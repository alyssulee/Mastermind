import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { RulesButtonComponent } from './rules-button/rules-button.component';
import { GameService } from './services/game-service.service';
import { WordGridComponent } from './word-grid/word-grid.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateGameComponent,
    JoinGameComponent,
    RulesButtonComponent,
    WordGridComponent,
    LoginComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    DialogModule, 
    ButtonModule, 
    RouterModule.forRoot(
      [
        { path:'', component:AppComponent},
        { path: 'game-page', component:JoinGameComponent }
      ]
    )
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
