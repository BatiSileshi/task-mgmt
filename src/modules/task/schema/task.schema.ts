import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";

@Schema({ timestamps: true })
export class Task {
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    startDate: Date;
    @Prop()
    dueDate: Date;
    //task has many comments
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref:'Comment'}]})
    comments: Comment[];
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User'})
    assignedTo: User;
    //list  m to 1
}
export const taskSchema = SchemaFactory.createForClass(Task);