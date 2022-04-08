import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateGameComponent } from './create-game/create-game.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { RulesButtonComponent } from './rules-button/rules-button.component';
import { GameService } from './services/game-service.service';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game/game.component';
import { WordGridComponent } from './word-grid/word-grid.component';
import { GameStateService } from './services/game-state.service';
import { ChatService } from './services/chat.service';
import { SendClueComponent } from './send-clue/send-clue.component';
import { MinionWordCardComponent } from './minion-word-card/minion-word-card.component';
import { MinionClueComponent } from './minion-clue/minion-clue.component';
import { RoomcodeComponent } from './roomcode/roomcode.component';
import { GameStatusComponent } from './game-status/game-status.component';
import { GameOverComponent } from './game-over/game-over.component';
import { MastermindWordCardComponent } from './mastermind-word-card/mastermind-word-card.component';
import { ChatComponent } from './chat/chat.component';
import { UserPopupComponent } from './user-popup/user-popup.component';
import { UserPopupBoxComponent } from './user-popup-box/user-popup-box.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CreateGameComponent,
    JoinGameComponent,
    RulesButtonComponent,
    WordGridComponent,
    LoginComponent,
    GameComponent,
    SendClueComponent,
    MinionWordCardComponent,
    MinionClueComponent,
    RoomcodeComponent,
    GameStatusComponent,
    GameOverComponent,
    MastermindWordCardComponent,
    ChatComponent,
    UserPopupComponent,
    UserPopupBoxComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DialogModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [GameService, GameStateService, ChatService],
  bootstrap: [AppComponent],
})
export class AppModule {}
