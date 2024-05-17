
export class UnAuthorizedException extends Error {
   constructor(
      public readonly message: string,
      public readonly status: number = 401,
   ) {
      super(message)
   }
}