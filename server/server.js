import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkwebhooks } from './controllers/webhooks.js'


//Initialize Express
const app = express()

//conect to database
await connectDB()

//MIddlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/',(req,res)=> res.send("API Working"))

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  app.post('/webhooks',clerkwebhooks)
  

//Port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);
// app.use(Sentry.Handlers.errorHandler());


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})


