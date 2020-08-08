import { Request, Response } from "express";
import db from "../database/connections";

export default class ConnectionsController{
    async index(req: Request, res: Response){
        //Count every row on the table and return the value as a variable named total
        const totalConnections = await db('connections').count('* as total');

        //Knex will always return an  array
        const { total } = totalConnections[0];

        res.json({total})

    }

    async create(req: Request, res: Response){
        const { user_id } = req.body;

        await db('connections').insert({
            user_id
        })

        return res.status(201).send()

    }
}