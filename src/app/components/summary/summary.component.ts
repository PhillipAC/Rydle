import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Summary } from '../../models/summary';
import { GameService } from '../../services/game.service';
import { RecordService } from '../../services/record.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [
    DecimalPipe
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  summary: Summary = new Summary();
  score: Number = new Number();

  constructor(private gameService: GameService, private recordService: RecordService){
  }

  ngOnInit(): void {
    this.gameService.gameWon$
      .subscribe((summary: Summary) => this.loadSummary(summary))
  }

  loadSummary(summary: Summary) {
    console.log(summary);
    this.summary = summary;
    this.score = this.recordService.loadGuesses().length;
  }
}
