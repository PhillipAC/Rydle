import { NgFor, NgClass } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { GuessResult } from '../../models/guessResult';

@Component({
  selector: 'app-guess',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass],
  templateUrl: './guess.component.html',
  styleUrl: './guess.component.scss'
})
export class GuessComponent implements OnInit {

  guessingEnabled = false;

  selectedField = 0;

  guess: number[] = [0,0,0,0];

  numberPad: number[][] = [[7,8,9],[4,5,6],[1,2,3]];

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
    console.log(event.key);
    let keyPressed: number = Number(event.key);
    if(event.key === "Enter")
    {
      this.checkGuess();
      this.selectedField = 0;
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
