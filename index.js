import 'dotenv/config'
import '../lib/system/config.js'
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import requestIp from 'request-ip'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'cookie-session'
import createRouter from '../lib/system/defineRoute.js'

const app = express()

app
   .set('json spaces', 3)
   .set('trust proxy', 1)
   .use(express.json())
   .use(requestIp.mw())
   .use(morgan('dev'))
   .use(bodyParser.json({ limit: '50mb' }))
   .use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))
   .use(session({ name: 'token', keys: ['session'], maxAge: 72 * 60 * 60 * 1000 }))
   .use(cookieParser())
   .use(cors())

await (new createRouter(app)).load(path.join(process.cwd(), 'routers'))

export default app