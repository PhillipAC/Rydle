import { Component } from '@angular/core';
import { GameService } from '../../services/game.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [NgIf],
  templateUrl: './share.component.html',
  styleUrl: './share.component.scss'
})
export class ShareComponent {

  showSuccess = false;

  constructor(private gameService: GameService){}

  copySummary()
  {
    let summary = this.gameService.generateGameSummary();
    navigator.clipboard.writeText(summary);
    this.showSuccess = true;
    setInterval(() => {this.showSuccess = false}, 1000);
  }
}
