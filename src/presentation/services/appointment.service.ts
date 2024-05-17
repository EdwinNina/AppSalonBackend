import { Appointment } from '../../data/mongo/models/Appointments';
import { endOfDay, formatISO, parse, startOfDay } from "date-fns";
import { isValid } from "date-fns";
import { BadRequestException } from '../../shared/exceptions/badRequest.exception';
import { NotFoundException } from '../../shared/exceptions/notFount.exception';
import { UnAuthorizedException } from '../../shared/exceptions/unAuthorized.exception';

interface AppointmentInt {
   services: string[]
   date: string
   time: string
   totalAmount: number
}

interface AppointmentParamsInt {
   date: string
}

export class AppointmentService {

   async create(data: AppointmentInt) {
      try {
         const newAppointment = await Appointment.create(data)
         return await newAppointment.save()
      } catch (error) {
         throw error
      }
   }

   async getAppointmentsByDate(params: AppointmentParamsInt) {
      const { date } = params

      try {
         const dateConverted = parse(date, 'dd/MM/yyyy', new Date())
         if(!isValid(dateConverted)) throw new BadRequestException('Invalid date')
         const isoDate = formatISO(dateConverted)
         const newDate = new Date(isoDate)

         const appointments = await Appointment.find({
            date: {
               $gte: startOfDay(newDate),
               $lte: endOfDay(newDate)
            }
         }).select('time')

         return appointments
      } catch (error) {
         throw error
      }
   }

   async getAppointmentById(id: string, userId: string) {
      try {
         const appointment = await Appointment.findById(id).populate('services')

         if(!appointment) throw new NotFoundException('Cita no encontrada')
         if(appointment.user?.toString() !== userId)
            throw new UnAuthorizedException('Cita no autorizada')

         return appointment
      } catch (error) {
         throw error
      }
   }

   async updateAppointment(id: string, userId: string, data: AppointmentInt) {
      try {
         const [_, appointment] = await Promise.all([
            this.getAppointmentById(id, userId),
            Appointment.findByIdAndUpdate(id, data, { new: true })
         ])

         return appointment
      } catch (error) {
         throw error
      }
   }

   async deleteAppointment(id: string, userId: string) {
      try {
         const appointment = await this.getAppointmentById(id, userId)
         await appointment.deleteOne()

         return {
            date: appointment.date,
            time: appointment.time
         }
      } catch (error) {
         throw error
      }
   }
}