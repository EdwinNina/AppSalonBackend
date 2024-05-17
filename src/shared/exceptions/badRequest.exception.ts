import { HttpStatus } from "../../interfaces/HttpStatus.interface";

export class BadRequestException extends Error {
   constructor(
      public readonly message: string,
      public readonly status: number = HttpStatus.BAD_REQUEST,
   ) {
      super(message)
   }
}