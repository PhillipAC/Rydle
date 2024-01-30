import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { ResultsComponent } from './components/results/results.component';
import { HelpComponent } from './components/help/help.component';
import { GuessComponent } from './components/guess/guess.component';
import { ShareComponent } from './components/share/share.component';
import { CommonModule, NgIf } from '@angular/common';
import { GameService } from './services/game.service';
import { GuessResult } from './models/guessResult';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
            CommonModule,
            NgIf,
            HttpClientModule,
            FormsModule,
            ResultsComponent,
            HelpComponent,
            GuessComponent,
            ShareComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Rydle';
  description = "";
  shareEnabled = false;

  constructor(private gameService: GameService){}

  ngOnInit(){
    this.gameService.gameLoaded$
      .subscribe((event: any) => this.description = event.text);
    this.gameService.getGameData()
      .subscribe((data) => this.gameService.setupGame(data.events));
    this.gameService.guessChecked$
      .subscribe((results: GuessResult) => this.shareEnabled = results.won);
  }
}
