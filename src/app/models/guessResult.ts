import { Direction } from "../enumerations/Direction";
import { Result } from "../enumerations/Result";
import { DigitResult } from "./digitResult";

export class GuessResult{
    constructor(public won: boolean, public unitResults: DigitResult[], 
        public Direction: Direction, public isValid: boolean)
    {}
}