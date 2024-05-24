import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { NgIf, NgFor } from '@angular/common';
import { Page } from '../../models/page';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent implements OnInit {

  showSuccess = false;
  eventPages: Page[] = [];

  constructor(private gameService: GameService){}

  ngOnInit(): void {
    this.eventPages = this.gameService.getSolutionEventUrls();
  }

  copySummary()
  {
    let summary = this.gameService.generateGameSummary();
    navigator.clipboard.writeText(summary);
    this.showSuccess = true;
    setTimeout(() => {this.showSuccess = false}, 1000);
  }
}
