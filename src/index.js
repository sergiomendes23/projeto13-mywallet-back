import express from "express";
import cors from "cors";
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

import AuthRouter from './Routes/AuthRouter.js';
import ActivityRouter from './Routes/ActivityRouter.js'

const server = express();
server.use(cors());
server.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

server.use(AuthRouter);
server.use(ActivityRouter);

server.listen(5000, () => {console.log('Servidor rodando na porta 5000')}) 