import { envs } from "../config/env-variables";
import { services } from "./beautyServices";
import { DatababaseConnection } from "./mongo/database";
import { ServiceModel } from "./mongo/models/Service.model";

export class SeedData {

   constructor() {
      this.connection()
   }

   private async connection() {
      await DatababaseConnection.connect({
         dbName: envs.MONGO_DBNAME,
         url: envs.MONGO_URL
      })
   }

   async seedDB() {
      try {
         await ServiceModel.insertMany(services)
         console.log('Seeding database successfully')
         process.exit();
      } catch (error) {
         console.log(error)
         process.exit(1);
      }
   }

   async clearDB() {
      try {
         await ServiceModel.deleteMany();
         console.log('Database cleared successfully')
         process.exit();
      } catch (error) {
         console.log(error)
         process.exit(1);
      }
   }
}