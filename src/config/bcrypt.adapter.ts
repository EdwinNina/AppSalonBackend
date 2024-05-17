import {genSaltSync, compareSync, hashSync} from 'bcrypt'

export class BcryptAdapter {

   static hashPassword(password: string): string {
      const salt = genSaltSync()

      return hashSync(password, salt)
   }

   static comparePassword(currentPassword: string, password: string): boolean {
      return compareSync(password, currentPassword)
   }
}