import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Mongoose } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";
import { Project } from "src/modules/project/schema/project.schema";
import { Schema as MongooseSchema } from "mongoose";
@Schema({ timestamps: true })
export class Team extends Document{
    @Prop()
    name: string;
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref:'User'}]})
    users: User[];
    @Prop({ type: MongooseSchema.Types.ObjectId, ref:'Project', unique: true})
    project: Project;
}
export const teamSchema = SchemaFactory.createForClass(Team);