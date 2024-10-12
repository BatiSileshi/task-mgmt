import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Task } from "src/modules/task/schema/task.schema";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class List extends Document{
    @Prop()
    name: string;
    //list has many tasks 
    @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref: 'Task'}]})
    tasks: Task;
}
export const listSchema = SchemaFactory.createForClass(List);