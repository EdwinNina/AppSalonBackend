import { NextFunction, Request, Response } from "express";
import { ServiceDto } from "../dtos/service.dto";
import { validate, ValidationError } from "class-validator";
import { HttpResponse } from "../../../shared/response/http.response";

export class ServicesMiddleware {

   static validator(req: Request, res: Response, next: NextFunction) {
      const {name, price} = req.body
      const valid = new ServiceDto()
      valid.name = name
      valid.price = price

      validate(valid).then((errors: ValidationError[]) => {
         if(errors.length > 0) {
            return HttpResponse.BadRequest(res, errors.at(0)?.constraints)
         }
         next()
      })
   }
}