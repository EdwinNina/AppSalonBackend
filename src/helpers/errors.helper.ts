import { Response } from "express"
import { UnAuthorizedException } from "../shared/exceptions/unAuthorized.exception"
import { HttpResponse } from "../shared/response/http.response"
import { BadRequestException } from "../shared/exceptions/badRequest.exception"

export const handleError = (res: Response, error: any) => {
   switch (true) {
      case error instanceof UnAuthorizedException:
         return HttpResponse.UnAuthorized(res, error.message)
      case error instanceof BadRequestException:
         return HttpResponse.BadRequest(res, error.message)
      default:
         return HttpResponse.InternalServerError(res, error)
   }
}