import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'


//Initialize Express
const app = express()

//conect to database
await connectDB()

//MIddlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/',(req,res)=> res.send("API Working"))

//Port
const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

// mongo pass 60HJJ6zh3abax8Qm
// G3RLhkORe9kwz3LE