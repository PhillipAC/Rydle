import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { PrngService } from './prng.service';
import { GuessResult } from '../models/guessResult';
import { Result } from '../enumerations/Result';
import { DigitResult } from '../models/digitResult';
import { Direction } from '../enumerations/Direction';
import { RecordService } from './record.service';
import { Summary } from '../models/summary';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  gameLoadedObserver = new Subject();
  guessCheckedObserver = new Subject<GuessResult>();
  gameWonObserver = new Subject<Summary | null>();
  public gameLoaded$ = this.gameLoadedObserver.asObservable();
  public guessChecked$ = this.guessCheckedObserver.asObservable();
  public gameWon$ = this.gameWonObserver.asObservable();

  day: number = 0;
  month: number = 0;
  year: number = 0;
  solution: any = null;

  isRandom: boolean = false;

  results: GuessResult[] = [];

  constructor(private http:HttpClient, private prng:PrngService, 
    private recordService: RecordService) { 
      recordService.guessLoaded$.subscribe(guesses => {
        for(var i = 0; i < guesses.length; i++)
        {
          let unitResults = guesses[i].unitResults;
          this.checkGuess(unitResults.map(x => x.digit), false);
        }
      })
    }

  reset(): void{
    this.day = 0;
    this.month = 0;
    this.year = 0;
    this.solution = null;
    this.isRandom = false;
    this.results = [];
  }

  getGuessCount(): number{
    return this.results.length;
  }

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

    console.log(this.day);
    console.log(this.month);

    let month = String(this.month).padStart(2,"0");
    let day = String(this.day).padStart(2,"0");
    let url =  `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`;
    return this.http.get(url);
  }

  getGameDataByCode(hexCode: string): Observable<any>{
    let date = this.decodeGameCode(hexCode);
    this.day = +date.substring(0, 2);
    this.month = +date.substring(2, 4);
    this.year = +date.substring(4);
    this.isRandom = true;
    console.log(this.day);
    console.log(this.month);
    console.log(this.year);

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

  checkGuess(guess: number[], saveGuess = true): void{
    let result = [Result.Black, Result.Black, Result.Black, Result.Black];
    let results: DigitResult[] = [];
    let direction: Direction = Direction.NA;
    console.log(guess);
    if(this.validateGuess(guess))
    {
      let won = false;
      let checkedAgainst: number[] = Array
        .from(this.solution.year.toString().padStart(4, "0"));
      let greenCount = 0;

      for(var i = 0; i < 4; i++)
      {
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

      if(greenCount == 3)
      {
        if(guess[0]*1000+guess[1]*100+guess[2]*10+guess[3] > +this.solution.year)
        {
          direction = Direction.Down;
        }
        else
        {
          direction = Direction.Up;
        }
      }

      else if(greenCount == 4)
      {
        won = true;
      }

      let newResult = new GuessResult(won, results, direction, true);

      this.results.push(newResult)

      if(!this.isRandom && saveGuess)
      {
        this.recordService.saveGuess(newResult);
      }
      console.log(newResult);
      this.guessCheckedObserver.next(newResult);
      if(won)
      {
        if(!this.isRandom){
          let summary: Summary;
          if(saveGuess){
            summary = this.recordService.saveToSummaryNewCount(this.results.length);
          }
          else{
            summary = this.recordService.loadSummary();
          }
          this.gameWonObserver.next(summary);
        }else{
          this.gameWonObserver.next(null);
        }
      }
    }
    else
    {
      this.guessCheckedObserver.next(new GuessResult(false, results, direction, false));
    }
  }

  generateGameSummary(): string
  {
    let summary = `Rydle`;
    if(!this.isRandom){
      summary += ` (${this.month.toString().padStart(2, "0")}/${this.day.toString().padStart(2, "0")}/${this.year})`;
    }
    else
    {
      summary += " (random)"
    }
    summary += ` [${this.results.length} moves]\n`;
    let onlyThree: number [] = [-1, -1, -1, 1];
    for(var i = 0; i < this.results.length; i++){
      if(this.results[i].Direction != Direction.NA){
        for(var j = 0; j < 4; j++){
          if(this.results[i].unitResults[j].result == Result.Black){
            onlyThree[i] = j;
          }
        }
      }
    }
    for(var i = 0; i < this.results.length; i++)
    {
        for(var j = 0; j < 4; j++)
        {
          if(this.results[i].Direction === Direction.NA){
            summary += this.getEmoji(this.results[i].unitResults[j].result);
          }
          else{
            if(onlyThree[i] === j){
              summary += this.getDirectionEmoji(this.results[i].Direction);
            }
            else{
              summary += this.getEmoji(this.results[i].unitResults[j].result);1
            }
          }
        }
        summary +="\n";
    }
    summary +="https://phillipac.github.io/Rydle/";
    if(this.isRandom)
    {
      summary += ("?random=" + this.getGameCode());
    }
    console.log(summary);
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

  getDirectionEmoji(direction: Direction)
  {
    switch(direction)
    {
      case Direction.Up:
        return "⬆️";
      case Direction.Down:
        return "⬇️";
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
        if(guess[j] != this.results[i].unitResults[j].digit)
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

  getGameCode(): string{
    let today = `${this.day}${this.month.toString().padStart(2, '0')}${this.year.toString().padStart(4,'0')}`;
    console.log(today);
    let hexCode = (+today).toString(16);
    console.log(hexCode);
    console.log(this.decodeGameCode(hexCode));
    return hexCode;
  }

  decodeGameCode(hexCode: string): string{
    var hex = parseInt(hexCode, 16).toString().padStart(8, '0')
    console.log(hex);
    return hex;
  }
}
