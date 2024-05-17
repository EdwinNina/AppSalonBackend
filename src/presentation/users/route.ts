import { Router } from "express";
import { AuthMiddleware } from "../auth/middlewares/auth.middleware";
import { UserController } from "./controller";
import { UserService } from "../services/user.service";

export class UserRoutes {

   static get routes(): Router {
      const routes = Router()

      const controller = new UserController(new UserService())

      routes.get('/:user/appointments', [AuthMiddleware.validateJwt], controller.getAppointments)

      return routes
   }
}