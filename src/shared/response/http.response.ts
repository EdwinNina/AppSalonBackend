import { Response } from "express";
import { HttpStatus } from "../../interfaces/HttpStatus.interface";

export class HttpResponse {

   static Ok(res: Response, data?: any): Response {
      return res.status(HttpStatus.OK).json({
         status: HttpStatus.OK,
         statusMsg: "Success",
         data
      })
   }
   
   static BadRequest(res: Response, data?: any): Response {
      return res.status(HttpStatus.BAD_REQUEST).json({
         status: HttpStatus.BAD_REQUEST,
         statusMsg: "Bad Request",
         error: data
      })
   }

   static NotFound(res: Response, data?: any): Response {
      return res.status(HttpStatus.NOT_FOUND).json({
         status: HttpStatus.NOT_FOUND,
         statusMsg: "Not Found",
         error: data
      })
   }

   static UnAuthorized(res: Response, data?: any): Response {
      return res.status(HttpStatus.UNAUTHORIZED).json({
         status: HttpStatus.UNAUTHORIZED,
         statusMsg: "UnAuthorized",
         error: data
      })
   }

   static Forbidden(res: Response, data?: any): Response {
      return res.status(HttpStatus.FORBIDDEN).json({
         status: HttpStatus.FORBIDDEN,
         statusMsg: "Forbidden",
         error: data
      })
   }

   static InternalServerError(res: Response, data?: any): Response {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
         status: HttpStatus.INTERNAL_SERVER_ERROR,
         statusMsg: "Internal Server Error",
         error: data
      })
   }
}