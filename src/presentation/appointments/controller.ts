import { Request, Response } from "express";
import { handleError } from "../../helpers/errors.helper";
import { AppointmentService } from "../services/appointment.service";
import { HttpResponse } from "../../shared/response/http.response";
import { validObjectId } from "../../helpers/mongo.helper";
import { EmailService } from "../services/email.service";
import { SendEmailOptions } from "../../interfaces/email.interface";
import { envs } from "../../config/env-variables";
import { convertToHumanFormat } from "../../helpers/dates.helper";

export class AppointmentController {

   constructor(
      private readonly appointmentService: AppointmentService,
      private readonly emailService: EmailService
   ) {}

   create = async(req: Request, res: Response) =>{
      const { user, ...appointment } = req.body

      appointment.user = user._id.toString()

      try {
         const result = await this.appointmentService.create(appointment)
         const emailOptions: SendEmailOptions = {
            to: envs.MAILER_ADMIN_EMAIL,
            subject: 'AppSalon - Appointment created',
            htmlBody: `
               <p>Hello Admin, tienes una nueva cita</p>
               <p>La cita sera el dia: ${convertToHumanFormat(result.date!)} a las ${result.time} horas</p>
            `
         }
         await this.emailService.sendEmail(emailOptions)

         return HttpResponse.Ok(res, 'Appointment created successfully')
      } catch (error) {
         handleError(res, error)
      }
   }

   getAppointmentsByDate = async(req: Request, res: Response) => {
      const date: string = req.query.date as string

      try {
         const result = await this.appointmentService.getAppointmentsByDate({ date })
         return HttpResponse.Ok(res, result)
      } catch (error) {
         handleError(res, error)
      }
   }

   getAppointmentById = async(req: Request, res: Response) => {
      const id: string = req.params.id

      if(validObjectId(id, res)) return HttpResponse.BadRequest(res, 'Invalid id provided')
      const userId = req.body.user._id.toString()

      try {
         const result = await this.appointmentService.getAppointmentById(id, userId)
         return HttpResponse.Ok(res, result)
      } catch (error) {
         handleError(res, error)
      }
   }

   updateAppointment = async(req: Request, res: Response) => {
      const id: string = req.params.id

      if(validObjectId(id, res)) return HttpResponse.BadRequest(res, 'Invalid id provided')

      const { user, ...data} = req.body
      const userId = user._id.toString()

      try {
         const result = await this.appointmentService.updateAppointment(id, userId, data)
         const {date, time} = result!

         const emailOptions: SendEmailOptions = {
            to: envs.MAILER_ADMIN_EMAIL,
            subject: 'AppSalon - Appointment updated',
            htmlBody: `
               <p>Hello Admin, Un usuario a modificado una cita</p>
               <p>La nueva cita sera el dia: ${convertToHumanFormat(date!)} a las ${time} horas</p>
            `
         }
         await this.emailService.sendEmail(emailOptions)

         return HttpResponse.Ok(res, 'Cita actualizada correctamente')
      } catch (error) {
         handleError(res, error)
      }
   }

   deleteAppointment = async(req: Request, res: Response) => {
      const id: string = req.params.id

      if(validObjectId(id, res)) return HttpResponse.BadRequest(res, 'Invalid id provided')

      const userId = req.body.user._id.toString()

      try {
         const result = await this.appointmentService.deleteAppointment(id, userId)
         const {date, time} = result

         const emailOptions: SendEmailOptions = {
            to: envs.MAILER_ADMIN_EMAIL,
            subject: 'AppSalon - Appointment canceled',
            htmlBody: `
               <p>Hello Admin, Un usuario a cancelado una cita</p>
               <p>La cita estaba programada para : ${convertToHumanFormat(date!)} a las ${time} horas</p>
            `
         }
         await this.emailService.sendEmail(emailOptions)

         return HttpResponse.Ok(res, 'Cita eliminada correctamente')
      } catch (error) {
         handleError(res, error)
      }
   }
}