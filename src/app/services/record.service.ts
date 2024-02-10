import { Injectable } from '@angular/core';
import { GuessResult } from '../models/guessResult';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private readonly Guesses = "Guesses";

  guessLoadedObserver = new Subject<GuessResult[]>();
  public guessLoaded$ = this.guessLoadedObserver.asObservable();

  constructor() { }

  getDate(): string{
    let today = new Date();
    let day = today.getDate().toString().padStart(2, "0");
    let month = (today.getMonth() + 1).toString().padStart(2, "0");
    let year = today.getFullYear().toString().padStart(4, "0");
    return `${day}/${month}/${year}`;
  }

  saveGuess(guessResult: GuessResult): void{
    let savedGuesses = this.loadGuesses();
    savedGuesses.push(guessResult);
    localStorage.setItem(this.Guesses, JSON.stringify({
      TimeStamp: this.getDate(),
      Guesses: savedGuesses
    }));
  }

  loadGuesses(): GuessResult[]{
    let rawData = localStorage.getItem(this.Guesses);
    if(rawData != null)
    {
      let data = JSON.parse(rawData);
      if(data.TimeStamp != this.getDate()){
        return [];
      }
      else{
        return data.Guesses;
      }
    }
    return [];
  }

  loadPastGuesses(): void{
    let guessResults = this.loadGuesses();
    console.log(guessResults);
    this.guessLoadedObserver.next(guessResults);
  }
}
