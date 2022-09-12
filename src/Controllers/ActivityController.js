import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import joi from 'joi';
import dayjs from "dayjs";
import 'dayjs/locale/pt-br.js';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});


// entrada

export async function income(req, res){
    try{
    const incomeSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    })

    const { error } = incomeSchema.validate(req.body)
    if (error){
        console.log(req.body)
        res.sendStatus(401)
        return
    }

    const userId = res.locals.userId;
    const {value, description} = req.body;

    await db.collection('balance').insertOne({
        value: value,
        description: description,
        type: "income",
        userId: userId,
        date: dayjs().format("DD/MM")
    })

    res.sendStatus(201)

    }catch(error){
        res.sendStatus(500)
    }
}

// saida

export async function outcome(req, res){
    try{
    const outcomeSchema = joi.object({
        value: joi.number().required(),
        description: joi.string().required()
    })

    const { error } = outcomeSchema.validate(req.body)
    if (error){
        res.sendStatus(401)
        return
    }

    const userId = res.locals.userId;
    const {value, description} = req.body;

    await db.collection('balance').insertOne({
        value: value,
        description: description,
        type: "outcome",
        userId: userId,
        date: dayjs().format("DD/MM")
    })

    res.sendStatus(201)

    }catch(error){
        res.sendStatus(500)
    }
}

//balanço

export async function balance(req, res){
    try{
        const userId = res.locals.userId;
        console.log(userId)
        const balance = await db.collection('balance').find({userId}).toArray();
        console.log(balance)
        res.send(balance);
}catch(error){
    console.log(error)
    res.sendStatus(500)
}
}