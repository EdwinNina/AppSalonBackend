import nodemailer from 'nodemailer'
import { envs } from '../../config/env-variables'
import { SendEmailOptions } from '../../interfaces/email.interface'

export class EmailService {

   private transporter = nodemailer.createTransport({
      host: envs.MAILER_HOST,
      port: envs.MAILER_PORT,
      auth: {
         user: envs.MAILER_USER,
         pass: envs.MAILER_PASSWORD
      }
   })

   async sendEmail(options: SendEmailOptions): Promise<boolean> {
      const {to, subject, htmlBody} = options
      try {
         await this.transporter.sendMail({
            to,
            subject,
            html: htmlBody,
         })
      } catch (error) {
         console.log(error)
         throw error
      }
      return true
   }
}