import { NextFunction, Request, Response } from "express";
import { UpdatePasswordDto } from "../dtos/update-password.dto";
import { validate, ValidationError } from "class-validator";
import { HttpResponse } from "../../../shared/response/http.response";

export class UpdatePasswordMiddleware {

   static checkPassword(req: Request, res: Response, next: NextFunction): void {
      const {password} = req.body
      const valid = new UpdatePasswordDto()
      valid.password = password

      validate(valid).then((error: ValidationError[]) => {
         if(error.length > 0) {
            return HttpResponse.BadRequest(res, error.map(e => e.constraints))
         }
         next()
      })
   }
}