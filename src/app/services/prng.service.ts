import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrngService {

  m: number = 0;
  a: number = 0;
  c: number = 0;
  state: number = 0;

  constructor() { 
    this.m = 0x80000000;
    this.a = 1103515245;
    this.c = 12345;

    this.reseedRandom();
  }

  reseedRandom(): void {
    this.state = Math.floor(Math.random() * (this.m - 1) );
  }

  reseed(seed: number): void {
    this.state = seed;
  }

  next(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state / (this.m - 1);
  }
}
