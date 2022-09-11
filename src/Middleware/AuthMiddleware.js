import {  MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
    db = mongoClient.db('myWallet');
});

export async function validateUser(req, res, next){
    const income = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "")
    
    const sessionInfo = await db.collection('sessions').findOne({token})

    if(!sessionInfo){
        return res.sendStatus(401);
    }

    res.locals.userId = ObjectId(sessionInfo.userId);

    next()
}

export default validateUser;