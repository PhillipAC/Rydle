import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GuessResult } from '../../models/guessResult';

@Component({
  selector: 'app-guess',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './guess.component.html',
  styleUrl: './guess.component.scss'
})
export class GuessComponent implements OnInit {

  guessingEnabled = false;

  guess = [0,0,0,0];

  constructor(private gameService: GameService){}

  ngOnInit()
  {
    this.gameService.gameLoaded$.subscribe(() => {this.guessingEnabled = true;});
    this.gameService.guessChecked$.subscribe((guessResult: GuessResult) => {
      if(!guessResult.won)
      {
        this.guessingEnabled = true;
      }
    });
  }

  checkGuess()
  {
    this.guessingEnabled = false;
    this.gameService.checkGuess(this.guess);
  }

  trackByIndex(index: number, item: any)
  {
    return index;
  }

  clampInput(event: any, input: any): void {
    let value = +event;
    if(value > 9)
    {
      value = 9;
    }
    else if(value < 0)
    {
      value = 0
    }
    if(input.value != value)
    {
      const start = input.selectionStart ? input.selectionStart - 1 : -1;
      input.value = value;
      if (start>=0) input.selectionStart = input.selectionEnd = start;
    }
  }
}
