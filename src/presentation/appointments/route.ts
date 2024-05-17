import { Router } from "express";
import { AppointmentController } from "./controller";
import { AppointmentService } from "../services/appointment.service";
import { AuthMiddleware } from "../auth/middlewares/auth.middleware";
import { EmailService } from "../services/email.service";

export class AppointmentRoutes {

   static get routes(): Router {
      const routes = Router()
      const controller = new AppointmentController(
         new AppointmentService(),
         new EmailService()
      )

      routes.post('/', [AuthMiddleware.validateJwt], controller.create)
      routes.get('/', [AuthMiddleware.validateJwt], controller.getAppointmentsByDate)
      routes.get('/:id', [AuthMiddleware.validateJwt], controller.getAppointmentById)
      routes.put('/:id/update', [AuthMiddleware.validateJwt], controller.updateAppointment)
      routes.delete('/:id', [AuthMiddleware.validateJwt], controller.deleteAppointment)

      return routes
   }
}