import express from "express";
import cors from "cors";
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

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
        return res.sendStatus(200);
    }catch(error){
        console.log(error.message);
    }
    
})

server.post('/login', async (req, res) => {
    const {email, senha} = req.body;

    const usuario = await db.collection('usuarios').findOne({email});
    const senhaValida = bcrypt.compareSync(senha, usuario.senha);

    if (!usuario && !senhaValida) {
        return res.send(400);
    }
    try{

        if (!senhaValida) {
            return res.send(401);
        }

        const token = uuid()
        await db.collection('sessions').insertOne({token, userId: usuario._id})

        return res.send(token).status(200)
       
    }catch{
        console.log(error.message);
    }
})





server.listen(5001, () => {console.log('Ouvindo a porta 5001')}) 