import { Router } from "express";
import { ServiceRoutes } from './client-services/routes';
import { AuthRoutes } from "./auth/route";
import { AppointmentRoutes } from "./appointments/route";
import { UserRoutes } from "./users/route";

export class AppRoutes {

   static get routes(): Router {
      const routes = Router()

      routes.use('/api/services', ServiceRoutes.routes)
      routes.use('/api/auth', AuthRoutes.routes)
      routes.use('/api/appointments', AppointmentRoutes.routes)
      routes.use('/api/user', UserRoutes.routes)

      return routes
   }
}