import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

export async function signUp(req, res) {
    try{
        const {nome, email, senha} = req.body;
        const cryptSenha = bcrypt.hashSync(senha, 10);
        const emailValido = await db.collection('usuarios').findOne({email});

        const newUserSchema = joi.object({
            nome: joi.string().required(),
            email: joi.string().email().required(),
            senha: joi.required(),
        });
        
        const { error } = newUserSchema.validate({nome, email, senha});

        if(error){
            res.status(422).send(error)
            return
        }

        if (emailValido) {
            return res.status(409).send('Esse usuário já existe!');
        }
        await db.collection('usuarios').insertOne({nome, email, senha: cryptSenha})
        return res.sendStatus(200);

    }catch(error){
        console.log(error.message);
    }
}

export async function signIn(req, res) {
    try{
        const {email, senha} = req.body;
        const usuario = await db.collection('usuarios').findOne({email});
        const senhaValida = bcrypt.compareSync(senha, usuario.senha);

        const userSchema = joi.object({
            email: joi.string().email().required(),
            senha: joi.string().required()
        });

        const { error } = userSchema.validate({email, senha})
        if(error){
            res.sendStatus(422);   
            return     
        }

        if (!usuario && !senhaValida) {
            return res.send(400);
        }
        if (!senhaValida) {
            return res.send(401);
        }

        const token = uuid()
        await db.collection('sessions').insertOne({token, userId: usuario._id, nome: usuario.nome});
        const usuarioLogado = await db.collection('sessions').findOne({token});
        return res.status(200).send(usuarioLogado)

    } catch(error){
        console.log(error.message);
    }
}