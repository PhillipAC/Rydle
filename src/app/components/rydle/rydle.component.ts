import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { GuessResult } from '../../models/guessResult';
import { CommonModule, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResultsComponent } from '../results/results.component';
import { HelpComponent } from '../help/help.component';
import { GuessComponent } from '../guess/guess.component';
import { ShareComponent } from '../share/share.component';
import { RecordService } from '../../services/record.service';
import { SummaryComponent } from '../summary/summary.component';

@Component({
  selector: 'app-rydle',
  standalone: true,
  imports: [RouterOutlet, 
    CommonModule,
    NgIf,
    HttpClientModule,
    FormsModule,
    SummaryComponent,
    ResultsComponent,
    HelpComponent,
    GuessComponent,
    ShareComponent],
  templateUrl: './rydle.component.html',
  styleUrl: './rydle.component.scss'
})
export class RydleComponent implements OnInit, AfterViewInit {
  description = "";
  shareEnabled = false;
  showSummary = false;
  showGuessInput = true;

  constructor(private gameService: GameService, private recordService: RecordService, 
    private activeRoute: ActivatedRoute){}

  ngOnInit(){
    this.gameService.gameLoaded$
      .subscribe((event: any) => this.description = event.text);

    this.gameService.guessChecked$
      .subscribe((results: GuessResult) => this.shareEnabled = results.won);

    this.gameService.gameWon$
      .subscribe(() => this.gameWon());
  }

  ngAfterViewInit(){
    let randomId = this.activeRoute.snapshot.queryParamMap.get("random");
    let isRandomGame = randomId === "";
    if(isRandomGame)
    {
      console.log("Is Random Game");
      this.gameService.getRandomGame()
        .subscribe((data) => this.gameService.setupGame(data.events));
    }
    else if(randomId != null)
    {
      this.gameService.getGameDataByCode(randomId)
        .subscribe((data) => this.gameService.setupGame(data.events));
    }
    else{
      this.gameService.getGameData()
        .subscribe((data) => {
          this.gameService.setupGame(data.events)
          this.recordService.loadPastGuesses();
        });
    }
  }

  gameWon() {
    console.log("Game Won");
    this.showSummary = true;
    this.showGuessInput = false;
  }
}
