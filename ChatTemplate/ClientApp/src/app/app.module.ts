import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ChatComponent } from './chat/chat.component';
import { BattleseaComponent } from './battlesea/battlesea.component';
import { SignalRService } from './services/signal-r.service';
import { RoomService } from './services/room.service';
import { RoomsComponent } from './rooms/rooms.component';
import { BattleProccesComponent } from './battle-procces/battle-procces.component';
import { PreparingComponent } from './preparing/preparing.component';
import { GameService } from './services/game.service';
import { EnumToKeyArrayPipe } from './enum-to-key-array.pipe';

const routes = [
  { path: '', component: BattleseaComponent, pathMatch: 'full' },
  { path: 'chat', component: ChatComponent },
  { path: 'battlesea', component: BattleseaComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ChatComponent,
    BattleseaComponent,
    RoomsComponent,
    BattleProccesComponent,
    PreparingComponent,
    EnumToKeyArrayPipe,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [SignalRService, RoomService, GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
