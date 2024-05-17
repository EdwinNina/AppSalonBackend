import { Appointment } from "../../data/mongo/models/Appointments"

export class UserService {

   async getAppointments(user: string, isAdmin: boolean) {
      const query = isAdmin ? { date: { $gte : new Date() } } : { user, date: { $gte : new Date() } }

      try {
         return await Appointment.find(query)
         .populate('services')
         .populate({
            path: 'user',
            select: 'username email'
         })
         .sort({ date: 'asc' })
      } catch (error) {
         throw error
      }
   } 
}