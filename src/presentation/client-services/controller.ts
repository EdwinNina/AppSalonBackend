import { Request, response, Response } from "express";
import { ClientService } from '../services/client.service';
import { HttpResponse } from "../../shared/response/http.response";
import { validObjectId } from "../../helpers/mongo.helper";

export class ServiceController {

   constructor(
      private readonly clientService: ClientService
   ) {}

   getServices = (req: Request, res: Response) => {
      this.clientService.getServices()
         .then((response) => HttpResponse.Ok(res, response))
         .catch(error => HttpResponse.NotFound(res, error))
   }

   create = (req: Request, res: Response) => {
      this.clientService.createService(req.body)
         .then((response) => HttpResponse.Ok(res, response))
         .catch(error => HttpResponse.BadRequest(res, error))
   }

   findById = (req: Request, res: Response) => {
      const {id} = req.params

      if(validObjectId(id, res)) return

      this.clientService.getServiceById(id)
         .then((response) => HttpResponse.Ok(res, response))
         .catch(error => HttpResponse.NotFound(res, error))
   }

   update = (req: Request, res: Response) => {
      const {id} = req.params

      if(validObjectId(id, res)) return

      this.clientService.updateService(req.body, id)
         .then((response) => HttpResponse.Ok(res, response))
         .catch(error => HttpResponse.InternalServerError(res, error))
   }

   delete = (req: Request, res: Response) => {
      const {id} = req.params

      if(validObjectId(id, res)) return

      this.clientService.deleteService(id)
         .then((response) => HttpResponse.Ok(res, response))
         .catch(error => HttpResponse.InternalServerError(res, error))
   }
}
