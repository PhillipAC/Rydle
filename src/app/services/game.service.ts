import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { PrngService } from './prng.service';
import { GuessResult } from '../models/guessResult';
import { Result } from '../../enumerations/Result';
import { DigitResult } from '../models/digitResult';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameLoadedObserver = new Subject();
  guessCheckedObserver = new Subject<GuessResult>();
  public gameLoaded$ = this.gameLoadedObserver.asObservable();
  public guessChecked$ = this.guessCheckedObserver.asObservable();

  day: number = 0;
  month: number = 0;
  year: number = 0;
  solution: any = null;

  results: DigitResult[][] = [];

  constructor(private http:HttpClient, private prng:PrngService) { }

  getGameData(): Observable<any>{
    let today = new Date();
    this.day = today.getDate();
    this.month = today.getMonth() + 1;
    this.year = today.getFullYear();

    let month = String(this.month).padStart(2,"0");
    let day = String(this.day).padStart(2,"0");
    let url =  `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;
    return this.http.get(url);
  }

  setupGame(data: any): void{
    let filteredEvents = data.filter((x: any) => x.year >= 0);
    let today = `${this.day}${this.month}${this.year}`;
    let rng = new PrngService();
    rng.reseed(+today);
    let randomNumber = rng.next();
    let index = Math.floor(randomNumber*(data.length+1));
    
    this.solution = filteredEvents[index];

    this.gameLoadedObserver.next(this.solution);
  }

  checkGuess(guess: number[]): void{
    let won = false;
    let result = [Result.Black, Result.Black, Result.Black, Result.Black];
    let results: DigitResult[] = [];
    let checkedAgainst = this.solution.year.toString().padStart(4, "0");
    let greenCount = 0;

    for(var i = 0; i < 4; i++)
    {
      let currentResult = Result.Black
      if(guess[i] == checkedAgainst[i])
      {
        greenCount++;
        currentResult = Result.Green;
      }
      else{
        for(var j = 0; j < 4; j++)
        {
          if(j != i && guess[i] == checkedAgainst[j])
          {
            currentResult = Result.Yellow;
          }
        }
      }
      results.push(new DigitResult(guess[i], currentResult));
    }

    if(greenCount == 4)
    {
      won = true;
    }

    let newResult = new GuessResult(won, results);

    this.results.push(results)

    this.guessCheckedObserver.next(newResult);
  }

  generateGameSummary(): string
  {
    let summary = `Rydle (${this.month}/${this.day}/${this.year})[${this.results.length} moves]\n`;
    for(var i = 0; i < this.results.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            summary += this.getEmoji(this.results[i][j].result);
        }
        summary +="\n";
    }
    summary +="https://phillipac.github.io/Rydle/";
    return summary
  }

  getEmoji(result: Result): string
  {
      switch(result)
      {
          case Result.Black:
              return "⬛";
          case Result.Yellow:
              return "🟨";
          case Result.Green:
              return "🟩";
          default:
              return "🤨";
      }
  }
}
