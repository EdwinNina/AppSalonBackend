import { ServiceModel } from "../../data/mongo/models/Service.model";

interface createServiceInt {
   name: string;
   price: number;
}

type updateServiceInt = Partial<createServiceInt>

export class ClientService {
   async createService(data: createServiceInt) {
      try {
         const newService = new ServiceModel(data)
         return await newService.save()
      } catch (error) {
         throw error
      }
   }

   async getServices() {
      return await ServiceModel.find()
   }

   async getServiceById(id: string) {
      const service = await ServiceModel.findById(id)

      if(!service) {
         throw 'Service not found with id: ' + id
      }

      return service
   }

   async updateService(data: updateServiceInt, id: string) {
      try {
         return await ServiceModel.findByIdAndUpdate(id, data, { new: true })
      } catch (error) {
         throw error
      }
   }

   async deleteService(id: string) {
      try {
         return await ServiceModel.findByIdAndDelete(id)
      } catch (error) {
         throw error
      }
   }
}