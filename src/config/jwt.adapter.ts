import jsonwebtoken from 'jsonwebtoken'
import { envs } from './env-variables'

interface SignOptions {
   payload: {[key: string]: any}
   expiresIn?: string
}

export class JwtAdapter {
   static sign(options: SignOptions) {
      const {payload, expiresIn = '2h'} = options
      const secretKey = envs.JWT_SECRET_KEY

      return new Promise(resolve => {
         jsonwebtoken.sign(payload, secretKey, {expiresIn}, (err, token) => {
            if (err) resolve(null)
            resolve(token)
         })
      })
   }
   
   static verify<T>(token: string): Promise<T|null> {
      return new Promise((resolve) => {
         const secretKey = envs.JWT_SECRET_KEY
         jsonwebtoken.verify(token, secretKey, (err, decoded) => {
            if (err) resolve(null)
            resolve(decoded as T)
         })
      })
   }

   static decode(token: string) {
      return jsonwebtoken.decode(token)
   }
}