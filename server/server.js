import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.config.js'
import router from './route/message.route.js'

const app = express() //app has all the powers of express like get,put,post e.t.c
const db = connectDB()
const port = process.env.PORT || 8000

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174'
];

if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(express.json()) //this act as a json translator, whenever a request in json format comes to server it parses it and creates a jabascript object which can be further used in from of req.body
// app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    res.send("Hello World");
})

app.get('/api/auth', async (req, res) => {
    res.send("API is Working");
})

app.use('/api/auth', router)
app.listen(port, () => {
    console.log(`Your server is running at ${port}`)
})