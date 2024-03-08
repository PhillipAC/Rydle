import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
import { ThemeService } from '../../services/theme.service';
import { SummaryComponent } from '../summary/summary.component';
import { LoadingComponent } from '../loading/loading.component';
import { Subscription } from 'rxjs';

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
    ShareComponent,
    LoadingComponent],
  templateUrl: './rydle.component.html',
  styleUrl: './rydle.component.scss'
})
export class RydleComponent implements OnInit, AfterViewInit, OnDestroy {
  description = "";
  shareEnabled = false;
  showSummary = false;
  showGuessInput = true;
  isLoading = true;

  gameLoadedSub: Subscription | null = null;
  guessCheckedSub: Subscription | null = null;
  gameWonSub: Subscription | null = null;

  constructor(private gameService: GameService, private recordService: RecordService, 
    private activeRoute: ActivatedRoute, private themeService: ThemeService){}

  ngOnInit(){
    this.themeService.loadMode();

    this.gameService.gameLoaded$
      .subscribe((event: any) => {
        this.description = event.text;
        this.isLoading = false;
      });

    this.gameService.guessChecked$
      .subscribe((results: GuessResult) => this.shareEnabled = results.won);

    this.gameService.gameWon$
      .subscribe(() => this.gameWon());
  }

  ngOnDestroy(): void {
      this.gameLoadedSub?.unsubscribe();
      this.gameWonSub?.unsubscribe();
      this.guessCheckedSub?.unsubscribe();
  }

  ngAfterViewInit(){
    let randomId = this.activeRoute.snapshot.queryParamMap.get("random");
    let isRandomGame = randomId === "";
    if(isRandomGame)
    {
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
    this.showSummary = true;
    this.showGuessInput = false;
  }
}
