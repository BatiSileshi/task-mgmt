import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Comment extends Document{
    @Prop()
    comment: string;
    @Prop({ default: false })
    isArchived: boolean;
    @Prop()
    deletedAt: Date;
    @Prop()
    deletedBy: string;
    @Prop()
    archiveReason: string;
    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
    creator: MongooseSchema.Types.ObjectId;
    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'Task'})
    task: MongooseSchema.Types.ObjectId;
}
export const commentSchema = SchemaFactory.createForClass(Comment);