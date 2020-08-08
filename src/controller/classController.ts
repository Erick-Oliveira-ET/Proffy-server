import { Request, Response } from "express";

import db from "../database/connections";
import convertHoursToMinutes from "../Util/convertHoursToMinutes";

interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class classController{
    async index(req: Request, res: Response){
        const filters = req.query;

        const week_day = filters.week_day as string;
        const subject = filters.subject as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {
            return res.status(400).json({
                error: "Missing a value on filter's field"
            });
        }

        const timeInMinutes = convertHoursToMinutes(time);

        const classes = await db('classes')
            .whereExists(function(){
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);
        

        res.json(classes);
        
    }


    async create(req: Request, res: Response){
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = req.body;
    
        //Makes a database alteration just if all the querries
        //are ready to send the data without any error
        const trx = await db.transaction();
    
        try {
            const insertedUsers = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });
        
            const user_id = insertedUsers[0];
        
            const insertedClasses = await trx('classes').insert({
                subject,
                cost,
                user_id
            });
        
            const class_id = insertedClasses[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHoursToMinutes(scheduleItem.from),
                    to: convertHoursToMinutes(scheduleItem.to)
                };
            })
        
            await trx('class_schedule').insert(classSchedule)
            
            //send all the changes at once
            await trx.commit();
    
            return res.status(201).send()
            
        } catch (err) {
            //unsend the changes
            trx.rollback();
            return res.status(400).send({
                error: "Unexpected Error on the database"
            })
        }
    }
}