import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { handleError } from "../../helpers/errors.helper";
import { HttpResponse } from "../../shared/response/http.response";

export class UserController {

   constructor(
      private readonly userService: UserService
   ) {}

   getAppointments = async(req: Request, res: Response) => {
      const {user} = req.params

      if(user !== req.body.user._id.toString()) {
         return HttpResponse.BadRequest(res, 'Denied access')
      }

      const isAdmin = req.body.user.admin

      try {
         const result = await this.userService.getAppointments(user, isAdmin)
         return HttpResponse.Ok(res, result)
      } catch (error) {
         handleError(res, error)
      }
   }
}