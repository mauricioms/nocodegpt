import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

export function configExpress(app: express.Express): void {
  app.use(cors())
  app.use(helmet())
  app.disable('x-powered-by')
}
