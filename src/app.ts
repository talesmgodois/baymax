import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import routes from './routes'
require('dotenv').config()
class App {
  public express: express.Application

  public constructor () {
    this.express = express()

    this.middlewares()
    this.database()
    this.routes()
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
  }

  private database (): void {
    mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/getjus`, { useNewUrlParser: true })
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default new App().express
