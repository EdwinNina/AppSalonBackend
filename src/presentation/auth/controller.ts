import { Request, Response } from "express";
import { AuthService } from '../services/auth.service';
import { HttpResponse } from '../../shared/response/http.response';
import { handleError } from "../../helpers/errors.helper";
import { EmailService } from "../services/email.service";
import { SendEmailOptions } from "../../interfaces/email.interface";
import { envs } from "../../config/env-variables";

export class AuthController {

   constructor(
      private readonly authService: AuthService,
      private readonly emailService: EmailService
   ){}

   private FRONTEND_URL = envs.FRONTEND_URL

   register = async (req: Request, res: Response) => {
      try {
         const result = await this.authService.register(req.body)
         const {email, token, username} = result!
         const frontendUrl = envs.FRONTEND_URL

         const emailOptions: SendEmailOptions = {
            to: email,
            subject: 'AppSalon - Account Verification',
            htmlBody: `
               <p>Hello ${username}, confirm your account in AppSalon</p>
               <p>Your account is almost ready; you just need to confirm it using the following link</p>
               <a href="${this.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirm account</a>
               <p>If you didn't create this account, you can ignore this message</p>
            `
         }
         await this.emailService.sendEmail(emailOptions)

         return HttpResponse.Ok(res, 'User created successfully, check your email')
      } catch (error) {
         handleError(res, error)
      }
   }

   login = async (req: Request, res: Response) => {
      try {
         const result = await this.authService.login(req.body)
         return HttpResponse.Ok(res, result)
      } catch (error) {
         handleError(res, error)
      }
   }

   confirmAccount = async (req: Request, res: Response) => {
      const {token} = req.params

      try {
         const result = await this.authService.confirmAccount(token)
         return HttpResponse.Ok(res, result)
      } catch (error) {
         handleError(res, error)
      }
   }

   getUser = async (req: Request, res: Response) => {
      const {user} = req.body

      return HttpResponse.Ok(res, user)
   }

   forgotPassword = async (req: Request, res: Response) => {
      const { email } = req.body

      try {
         const user = await this.authService.forgotPassword(email)
         const {username, token} = user

         const emailOptions: SendEmailOptions = {
            to: email,
            subject: 'AppSalon - Reset Password',
            htmlBody: `
               <p>Hello ${username}, reset password in AppSalon</p>
               <p>Your password wil be reset using the following link</p>
               <a href="${this.FRONTEND_URL}/auth/restablecer-password/${token}">Reset password</a>
               <p>If you didn't request this, you can ignore this message</p>
            `
         }
         await this.emailService.sendEmail(emailOptions)
         return HttpResponse.Ok(res, 'Hemos enviado un email con las instrucciones')
      } catch (error) {
         handleError(res, error)
      }
   }

   verifyResetToken = async (req: Request, res: Response) => {
      const { token } = req.params
      try {
         await this.authService.verifyToken(token)
         return HttpResponse.Ok(res, 'Token correcto')
      } catch (error) {
         handleError(res, error)
      }
   }

   updatePassword = async (req: Request, res: Response) => {
      const {token} = req.params
      const {password} = req.body

      try {
         await this.authService.updatePassword(token, password)
         return HttpResponse.Ok(res, 'Contraseña actualizada correctamente')
      } catch (error) {
         handleError(res, error)
      }
   }
}