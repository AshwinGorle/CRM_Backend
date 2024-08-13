import express from 'express';
import dotenv from 'dotenv';
import clientMasterRouter from './routes/client/clientMasterRoute.js';
import connectDb from "./connectDb.js"
import { error } from './middlewares/error.middleware.js';
import cors from 'cors';
import contactMasterRouter from './routes/contact/contactMasterRoute.js';
import tenderMasterRouter from './routes/tender/tenderMasterRoute.js';
import registrationMasterRouter from './routes/registration/registrationMasterRouter.js';
import configurationRoute from './routes/configuration/configurationRoute.js';
import teamRouter from './routes/team/teamRouter.js';
const app = express();
dotenv.config();
const corsOptions = {
    origin : "*",
    credentials : true
}

app.use(cors(corsOptions));
app.use(express.urlencoded({extended : false}));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DATABASE_URL; 
connectDb(DB_URL);

app.use('/client', clientMasterRouter);
app.use('/team', teamRouter );
app.use('/contact', contactMasterRouter);
app.use('/tender',tenderMasterRouter);
app.use('/registration', registrationMasterRouter);
app.use('/configuration', configurationRoute);
app.use(error);

app.listen(1234, ()=>{
    console.log('Server is running on port 1234.....');
})