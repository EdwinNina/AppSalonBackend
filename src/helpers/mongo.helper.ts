import mongoose from "mongoose"
import { HttpResponse } from "../shared/response/http.response"
import { Response } from "express"

export const validObjectId = (id: string, res: Response) => {
   if(!mongoose.Types.ObjectId.isValid(id)) {
      return HttpResponse.BadRequest(res, 'Is not a valid id.')
   }
}

export const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)