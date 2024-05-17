import { Router } from "express";
import { AuthController } from "./controller";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";
import { UpdatePasswordMiddleware } from "./middlewares/password.middleware";
import { AuthMiddleware } from "./middlewares/auth.middleware";

export class AuthRoutes {

   static get routes(): Router {
      const routes = Router()

      const controller = new AuthController(
         new AuthService(),
         new EmailService()
      )

      routes.post('/register', [AuthMiddleware.registerValidator], controller.register)
      routes.post('/login', [AuthMiddleware.loginValidator], controller.login)
      routes.get('/verify/:token', controller.confirmAccount)
      routes.post('/forgot-password', controller.forgotPassword)
      routes.route('/forgot-password/:token')
         .get(controller.verifyResetToken)
         .post([UpdatePasswordMiddleware.checkPassword], controller.updatePassword)

      // private routes
      routes.get('/user', [AuthMiddleware.validateJwt], controller.getUser)
      routes.get('/admin', [AuthMiddleware.validateJwt, AuthMiddleware.isAdminUser], controller.getUser)

      return routes
   }
}