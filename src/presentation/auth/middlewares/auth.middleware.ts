import { NextFunction, Request, Response } from "express";
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { validate, ValidationError } from "class-validator";
import { HttpResponse } from "../../../shared/response/http.response";
import { JwtAdapter } from "../../../config/jwt.adapter";
import { User } from "../../../data/mongo/models/User.model";

export class AuthMiddleware {

   static registerValidator(req: Request, res: Response, next: NextFunction): void {
      const {username, email, password} = req.body
      const valid = new RegisterDto()

      valid.username = username
      valid.email = email
      valid.password = password

      validate(valid).then((error: ValidationError[]) => {
         if( error.length > 0) {
            return HttpResponse.BadRequest(res, error.map(e => e.constraints))
         }
         next()
      })
   }

   static loginValidator(req: Request, res: Response, next: NextFunction): void {
      const {email, password} = req.body
      const valid = new LoginDto()

      valid.email = email
      valid.password = password

      validate(valid).then((error: ValidationError[]) => {
         if( error.length > 0) {
            return HttpResponse.BadRequest(res, error.map(e => e.constraints))
         }
         next()
      })
   }

   static async validateJwt(req: Request, res: Response, next: NextFunction) {
      const authorization: string|undefined = req.header('Authorization')

      if(!authorization) return HttpResponse.UnAuthorized(res, 'No token provided')
      if(!authorization.startsWith('Bearer ')) return HttpResponse.UnAuthorized(res, 'Invalid Bearer token')

      const token = authorization.split(' ').at(1)
      const payload = await JwtAdapter.verify<{id: string}>(token!)

      if(!payload) return HttpResponse.BadRequest(res, 'Invalid token')
   
      try {
         const user = await User.findById(payload.id).select("-password -verified -token -__v")
         if(!user) return HttpResponse.NotFound(res, 'User not found')
         req.body.user = user
      } catch (error) {
         return HttpResponse.InternalServerError(res, error)
      }
      next()
   }

   static async isAdminUser(req: Request, res: Response, next: NextFunction) {
      try {
         const { user } = req.body
         if(!user.admin) return HttpResponse.Forbidden(res, 'No users, just for admin user')
      } catch (error) {
         return HttpResponse.InternalServerError(res, error)
      }
      next()
   }
}