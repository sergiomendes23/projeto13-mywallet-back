import express from "express";
import cors from "cors";
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

const server = express();
server.use(cors());
server.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

server.post('/cadastro', async (req,res) => {
    const {nome, email, senha} = req.body;
    const cryptSenha = bcrypt.hashSync(senha, 10);
    const emailValido = await db.collection('usuarios').findOne({email});

    if (emailValido) {
        return res.status(409).send('Esse usuário já existe!');
    }

    try {
        await db.collection('usuarios').insertOne({nome, email, senha: cryptSenha})
        return res.send(200);
    }catch(error){
        console.log(error.message);
    }
    
})

server.listen(5000, () => {console.log('ouvindo a portinha 5000')}) 