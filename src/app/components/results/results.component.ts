import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GuessResult } from '../../models/guessResult';
import { GameService } from '../../services/game.service';
import { Direction } from '../../enumerations/Direction';
import { Subscription } from 'rxjs';

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
export class ResultsComponent implements OnInit, OnDestroy {
  guessResults: GuessResult[] = [];
  guessCheckedSub: Subscription | null = null;

  constructor(private gameService: GameService){
  }

  ngOnInit(): void {
    this.gameService.guessChecked$.subscribe((result: GuessResult) => {this.loadResult(result);});
  }

  ngOnDestroy(): void {
      this.guessCheckedSub?.unsubscribe();
  }

  loadResult(results: GuessResult): void{
    console.log(results);
    if(results.isValid)
    {
      this.guessResults.unshift(results);
    }
  }

  public get direction(): typeof Direction {
    return Direction; 
  }
}
