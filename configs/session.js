import {config} from 'dotenv'

config()

export const SESSION_OPTION = {
  secret: process.env.SESSION_SECRET,
  name: process.env.SESSION_NAME,
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: process.env.NODE_ENV === 'production',
    sameSite: true,
  },
  resave: false,
  rolling: true,
  saveUninitialized: false
}