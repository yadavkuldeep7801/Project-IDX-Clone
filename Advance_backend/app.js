

import express from 'express';

import dotenv from 'dotenv';
dotenv.config();
import projectRoute from './routes/ProjectRoute.js';


import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {

    res.send("<h1>Welcome to the New era of IDE</h1>")

})

app.use('/api/v1/project', projectRoute)



app.listen(PORT, () => {
    console.log(`localhost:${PORT} is running`)

})