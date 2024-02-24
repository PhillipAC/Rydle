import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { Summary } from '../../models/summary';
import { GameService } from '../../services/game.service';
import { RecordService } from '../../services/record.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    DecimalPipe,
    NgIf
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit, OnDestroy {

  summary: Summary | null = null;
  score: Number = 0;

  gameWonSub: Subscription | null = null;

  constructor(private gameService: GameService){
  }

  ngOnInit(): void {
    this.gameService.gameWon$
      .subscribe((summary: Summary | null) => this.loadSummary(summary))
  }

  ngOnDestroy(): void {
    this.gameWonSub?.unsubscribe();
  }

  loadSummary(summary: Summary | null) {
    this.summary = summary;
    this.score = this.gameService.getGuessCount();
  }
}
