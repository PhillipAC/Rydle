import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GuessResult } from '../../models/guessResult';
import { GameService } from '../../services/game.service';
import { Direction } from '../../enumerations/Direction';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    NgClass,
    NgFor,
    NgIf
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
  guessResults: GuessResult[] = [];

  constructor(private gameService: GameService){
  }

  ngOnInit(): void {
    this.gameService.guessChecked$.subscribe((result: GuessResult) => {this.loadResult(result);});
  }

  loadResult(results: GuessResult): void{
    if(results.isValid)
    {
      this.guessResults.push(results);
    }
  }

  public get direction(): typeof Direction {
    return Direction; 
  }
}
