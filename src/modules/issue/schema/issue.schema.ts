import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Issue extends Document{
    @Prop()
    title: string;
    @Prop()
    description: string;
    @Prop()
    status: string;
    @Prop({ default: false })
    isArchived: boolean;
    @Prop()
    deletedAt: Date;
    @Prop()
    deletedBy: string;
    @Prop()
    archiveReason: string;
    @Prop({type: MongooseSchema.Types.ObjectId, ref: 'User'})
    raiser: MongooseSchema.Types.ObjectId;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
    project: MongooseSchema.Types.ObjectId;
}
export const issueSchema = SchemaFactory.createForClass(Issue);