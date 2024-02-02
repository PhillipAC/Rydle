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

  isRandom: boolean = false;

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

  getRandomGame(): Observable<any>{
    let date = new Date(new Date().valueOf() - Math.random()*(1e+12));
    this.day = date.getDate();
    this.month = date.getMonth() + 1;
    this.year = date.getFullYear();
    this.isRandom = true;

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
    let result = [Result.Black, Result.Black, Result.Black, Result.Black];
    let results: DigitResult[] = [];
    if(this.validateGuess(guess))
    {
      let won = false;
      let checkedAgainst: number[] = Array
        .from(this.solution.year.toString().padStart(4, "0"));
      let greenCount = 0;

      for(var i = 0; i < 4; i++)
      {
        let currentResult = Result.Black
        if(guess[i] == checkedAgainst[i])
        {
          greenCount++;
          result[i] = Result.Green;
          checkedAgainst[i] = -1;
        }
      }
      for(var i = 0; i < 4; i++)
      {
        if(result[i] != Result.Green)
        {
          let location = checkedAgainst.findIndex(x => x == guess[i]);
          if(location != -1)
          {
            result[i] = Result.Yellow;
            checkedAgainst[location] = -1;
          }
        }
        results.push(new DigitResult(guess[i], result[i], i));
      }

      if(greenCount == 4)
      {
        won = true;
      }

      let newResult = new GuessResult(won, results, true);

      this.results.push(results)


      this.guessCheckedObserver.next(newResult);
    }
    else
    {
      this.guessCheckedObserver.next(new GuessResult(false, results, false));
    }
  }

  generateGameSummary(): string
  {
    let summary = `Rydle`;
    if(!this.isRandom){
      summary += ` (${this.month}/${this.day}/${this.year})`;
    }
    else
    {
      summary += " (random)"
    }
    summary += `[${this.results.length} moves]\n`;
    for(var i = 0; i < this.results.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
            summary += this.getEmoji(this.results[i][j].result);
        }
        summary +="\n";
    }
    summary +="https://phillipac.github.io/Rydle/";
    if(this.isRandom)
    {
      summary +="random";
    }
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

  validateGuess(guess: number[]): boolean
  {
    for(var i = 0; i < this.results.length; i++)
    {
      let isSame = true;
      for(var j = 0; j < guess.length; j++)
      {
        if(guess[j] != this.results[i][j].digit)
        {
          isSame = false;
          break;
        }
      }
      if(isSame)
      {
        return false;
      }
    }
    return true;
  }
}
