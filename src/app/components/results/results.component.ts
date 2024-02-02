import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GuessResult } from '../../models/guessResult';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    NgClass,
    NgFor
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  guessResults: GuessResult[] = [];

  constructor(private gameService: GameService){
  }

  ngOnInit(): void {
    this.gameService.guessChecked$.subscribe((result: GuessResult) => {console.log(result);this.loadResult(result);});
  }

  loadResult(results: GuessResult): void{
    this.guessResults.unshift(results);
  }
}
