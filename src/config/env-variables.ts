import 'dotenv/config'
import { get } from "env-var"

export const envs = {
   APP_URL: get('APP_URL').required().asString(),
   PORT: get('PORT').required().asPortNumber(),
   MONGO_URL: get('MONGO_URL').required().asString(),
   MONGO_USER: get('MONGO_USER').required().asString(),
   MONGO_PASSWORD: get('MONGO_PASSWORD').required().asString(),
   MONGO_DBNAME: get('MONGO_DBNAME').required().asString(),
   FRONTEND_URL: get('FRONTEND_URL').required().asString(),
   MAILER_HOST: get('MAILER_HOST').required().asString(),
   MAILER_PORT: get('MAILER_PORT').required().asPortNumber(),
   MAILER_USER: get('MAILER_USER').required().asString(),
   MAILER_PASSWORD: get('MAILER_PASSWORD').required().asString(),
   JWT_SECRET_KEY: get('JWT_SECRET_KEY').required().asString(),
   MAILER_ADMIN_EMAIL: get('MAILER_ADMIN_EMAIL').required().asString(),
}