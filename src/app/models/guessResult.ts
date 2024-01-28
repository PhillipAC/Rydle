import { Result } from "../../enumerations/Result";
import { DigitResult } from "./digitResult";

export class GuessResult{
    constructor(public won: boolean, public unitResults: DigitResult[])
    {}
}