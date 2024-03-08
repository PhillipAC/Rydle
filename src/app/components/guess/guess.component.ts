import { NgFor, NgClass, NgIf } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GuessResult } from '../../models/guessResult';
import { Observable, Subscription } from 'rxjs';
import { Summary } from '../../models/summary';

@Component({
  selector: 'app-guess',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass, NgIf],
  templateUrl: './guess.component.html',
  styleUrl: './guess.component.scss'
})
export class GuessComponent implements OnInit, OnDestroy {

  showError = false;
  
  guessingEnabled = false;

  selectedField = 0;

  guess: number[] = [0,0,0,0];

  numberPad: number[][] = [[7,8,9],[4,5,6],[1,2,3]];

  gameLoadedSubscription: Subscription | null = null;
  guessCheckedSub: Subscription | null = null;

  constructor(private gameService: GameService){}

  ngOnDestroy(): void {
    this.gameLoadedSubscription?.unsubscribe();
    this.guessCheckedSub?.unsubscribe();
  }

  ngOnInit()
  {
    this.gameLoadedSubscription = this.gameService.gameLoaded$.subscribe(() => {this.guessingEnabled = true;});
    this.guessCheckedSub = this.gameService.guessChecked$.subscribe((guessResult: GuessResult) => {
      this.guessingEnabled = false;
      if(!guessResult.isValid)
      {
        this.showError = true;
        setTimeout(() => {
          this.showError = false;
          this.guessingEnabled = true;
        }, 500);
      }
      else if(!guessResult.won)
      {
        this.guessingEnabled = true;
      }
    });
  }

  checkGuess()
  {
    if(this.guessingEnabled)
    {
      this.selectedField = 0;
      this.guessingEnabled = false;
      this.gameService.checkGuess(this.guess);
    }
  }

  trackByIndex(index: number, item: any)
  {
    return index;
  }

  setFocus(index: number)
  {
    this.selectedField = index;
  }

  updateGuess(value: number){
    this.guess[this.selectedField] = value;
    this.shiftRight();
  }

  @HostListener('window:keyup', ['$event'])
  onKeyPress(event: KeyboardEvent){
    let keyPressed: number = Number(event.key);
    if(event.key === "Enter")
    {
      this.checkGuess();
    }
    else if(event.key === "ArrowLeft")
    {
      this.shiftLeft();
    }
    else if(event.key === "ArrowRight")
    {
      this.shiftRight();
    }
    else if(event.key === "Backspace")
    {
      this.guess[this.selectedField] = 0;
      this.shiftLeft();
    }
    else if(!(isNaN(keyPressed) || event.key === null || event.key === ' '))
    {
      this.updateGuess(keyPressed);
    }
  }

  shiftLeft()
  {
    if(this.selectedField != 0)
    {
      this.selectedField--;
    }
  }

  shiftRight()
  {
    if(this.selectedField != 3)
    {
      this.selectedField++;
    }
  }

  onKeyPadPress(value: number)
  {
    if(value === -2){
      this.shiftLeft();
    }
    else if(value === -1){
      this.shiftRight();
    }
    else{
      this.updateGuess(value);
    }
  }
}
