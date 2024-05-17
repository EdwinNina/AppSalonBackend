import express, { Router } from 'express'
import cors, { CorsOptions } from 'cors'
import { envs } from '../config/env-variables';

interface Options {
   port: number;
   routes: Router
}

export class Server {

   private readonly app = express()
   private readonly port: number
   private readonly routes: Router
   private serverListener?: any

   constructor(options: Options) {
      const {port, routes} = options
      this.port = port
      this.routes = routes
   }

   async start() {
      this.app.use(express.json())
      this.app.use(express.urlencoded({ extended: true }))
      const whiteList = [envs.FRONTEND_URL, undefined]
      const corsOption: CorsOptions = {
         origin: function(origin, callback) {
            if(whiteList.includes(origin!)) {
               callback(null, true)
            } else {
               callback(new Error('Cors error'))
            }
         },
      }

      this.app.use(cors(corsOption))
      this.app.use(this.routes)

      this.serverListener = this.app.listen(this.port, () => {
         console.log(`Server listening on port ${this.port}`)
      })
   }

   public close () {
      this.serverListener?.close()
   }
}