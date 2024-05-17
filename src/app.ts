import { envs } from "./config/env-variables"
import { DatababaseConnection } from "./data/mongo/database"
import { AppRoutes } from "./presentation/routes"
import { Server } from "./presentation/server"

(() => {
   main()
})()

function main() {
   DatababaseConnection.connect({
      dbName: envs.MONGO_DBNAME,
      url: envs.MONGO_URL
   })

   const server = new Server({
      port: envs.PORT,
      routes: AppRoutes.routes
   })

   server.start()
}