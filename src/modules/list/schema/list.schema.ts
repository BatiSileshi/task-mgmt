import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Task } from "src/modules/task/schema/task.schema";
import { Document } from "mongoose";
import { Project } from "src/modules/project/schema/project.schema";

@Schema({ timestamps: true })
export class List extends Document{
    @Prop()
    name: string;
    @Prop({ default: false })
    isArchived: boolean;
    @Prop()
    deletedAt: Date;
    @Prop()
    deletedBy: string;
    @Prop()
    archiveReason: string;
    @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref: 'Task'}]})
    tasks: Task;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
    project: MongooseSchema.Types.ObjectId;
  
}
export const listSchema = SchemaFactory.createForClass(List);