
export class NotFoundException extends Error {
   constructor(
      public readonly message: string,
      public readonly status: number = 404,
   ) {
      super(message)
   }
}