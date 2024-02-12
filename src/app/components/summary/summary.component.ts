import { Component, OnInit } from '@angular/core';
import { Summary } from '../../models/summary';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  summary: Summary = new Summary();

  constructor(private gameService: GameService){
  }

  ngOnInit(): void {
    this.gameService.gameWon$
      .subscribe((summary: Summary) => this.loadSummary(summary))
  }

  loadSummary(summary: Summary) {
    console.log(summary);
    this.summary = summary;
  }
}
