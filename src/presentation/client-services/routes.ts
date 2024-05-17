import { Router } from "express";
import { ServiceController } from './controller';
import { ClientService } from "../services/client.service";
import { ServicesMiddleware } from "./middlewares/service.middleware";

export class ServiceRoutes {

   static get routes(): Router {
      const routes = Router()
      const service = new ClientService()
      const controller = new ServiceController(service)

      routes.get('/', controller.getServices)
      routes.post('/', [ ServicesMiddleware.validator ], controller.create)
      routes.get('/:id', controller.findById)
      routes.put('/:id', controller.update)
      routes.delete('/:id', controller.delete)

      return routes
   }
}