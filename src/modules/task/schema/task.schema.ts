import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";
import { Document } from "mongoose";
@Schema({ timestamps: true })
export class Task extends Document{
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    startDate: string;
    @Prop()
    dueDate: string;
    @Prop({ type: Date })
    completedAt: string;
    @Prop({ default: false })
    isArchived: boolean;
    @Prop()
    status: string;
    @Prop()
    deletedAt: Date;
    @Prop()
    deletedBy: string;
    @Prop()
    archiveReason: string;
    //task has many comments
    @Prop({type: [{type: MongooseSchema.Types.ObjectId, ref:'Comment'}]})
    comments: Comment[];
    @Prop({type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User'}]})
    assignedTo: MongooseSchema.Types.ObjectId[];
    //list  m to 1
    @Prop({type: MongooseSchema.Types.ObjectId, ref:'List', required: true})
    list: MongooseSchema.Types.ObjectId;
}
export const taskSchema = SchemaFactory.createForClass(Task);