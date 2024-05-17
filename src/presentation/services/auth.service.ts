import { BcryptAdapter } from "../../config/bcrypt.adapter";
import { envs } from "../../config/env-variables";
import { JwtAdapter } from "../../config/jwt.adapter";
import { User } from "../../data/mongo/models/User.model";
import { uniqueId } from "../../helpers/mongo.helper";
import { BadRequestException } from "../../shared/exceptions/badRequest.exception";
import { UnAuthorizedException } from "../../shared/exceptions/unAuthorized.exception";
import { EmailService } from "./email.service";

interface RegisterInt {
   username: string;
   email: string;
   password: string;
}

interface EmailOptions {
   username: string,
   email: string,
   token: string 
}

type LoginInt = Omit<RegisterInt, 'username'>

export class AuthService {

   async register(credentials: RegisterInt) {
      const {email, password, username} = credentials;

      const userExists = await User.findOne({ email })

      try {
         if(userExists) throw new BadRequestException(`User with email ${email} already exists`)

         const passwordHashed = BcryptAdapter.hashPassword(password)
         const newUser = await User.create({ username, email, password: passwordHashed })
         return await newUser.save()

      } catch (error) {
         throw error
      }
   }

   async login(credentials: LoginInt) {
      const {email, password} = credentials

      try {
         const user = await User.findOne({ email })
         if(!user)
            throw new UnAuthorizedException(`User with email ${email} not found`)
         if(!BcryptAdapter.comparePassword(user.password, password))
            throw new UnAuthorizedException('Password is incorrect')
         if(!user.verified)
            throw new UnAuthorizedException('Your account has not been verified yet')
         const payload = { id: user._id }

         return await JwtAdapter.sign({payload})
      } catch (error) {
         throw error
      }
   }

   async confirmAccount(token: string) {
      const user = await User.findOne({ token })

      try {
         if(!user) throw new UnAuthorizedException(`User with token ${token} not found`)

         user.verified = true
         user.token = ''
         await user.save()

         return 'Account verified successfully'
      } catch (error) {
         throw error
      }
   }

   async forgotPassword(email: string) {
      try {
         const user = await User.findOne({ email })
         if(!user)
            throw new UnAuthorizedException(`User with email ${email} not found`)
         if(!user.verified)
            throw new UnAuthorizedException('Your account has not been verified yet')

         user.token = uniqueId()

         return await user.save()
      } catch (error) {
         throw error
      }
   }

   async verifyToken(token: string) {
      try {
         const user = await User.findOne({ token })
         if(!user) throw new UnAuthorizedException(`User with token ${token} not found`)
      } catch (error) {
         throw error
      }
      return true
   }

   async updatePassword(token: string, password: string) {
      try {
         const user = await User.findOne({ token })
         if(!user) throw new UnAuthorizedException(`User with token ${token} not found`)

         user.password = BcryptAdapter.hashPassword(password)
         user.token = ''
         await user.save()
      } catch (error) {
         throw error
      }
      return true
   }
}