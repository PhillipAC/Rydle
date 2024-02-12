import { Injectable } from '@angular/core';
import { GuessResult } from '../models/guessResult';
import { Subject } from 'rxjs';
import { Summary } from '../models/summary';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private readonly GuessesKey = "Guesses";
  private readonly SummaryKey = "Rydle.Summary";

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
    localStorage.setItem(this.GuessesKey, JSON.stringify({
      TimeStamp: this.getDate(),
      Guesses: savedGuesses
    }));
  }

  loadGuesses(): GuessResult[]{
    let rawData = localStorage.getItem(this.GuessesKey);
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

  saveToSummaryNewCount(turnCount: number): Summary{
    let currentSummary = this.loadSummary();
    let totalCount: number = currentSummary.averageTurns*currentSummary.gamesPlayed;
    totalCount += turnCount;
    currentSummary.gamesPlayed++;
    currentSummary.averageTurns = totalCount / currentSummary.gamesPlayed;
    return this.saveToSummary(currentSummary);
  }

  saveToSummary(summary: Summary): Summary{
    localStorage.setItem(this.SummaryKey, JSON.stringify(summary));
    return summary;
  }

  loadSummary(): Summary{
    let rawData = localStorage.getItem(this.SummaryKey);
    if(rawData != null)
    {
      return JSON.parse(rawData);
    }
    return new Summary();
  }
}
