import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Profile } from "./profile.schema";
import { Project } from "src/modules/project/schema/project.schema";
import { Team } from "src/modules/team/schema/team.schema";
import { Task } from "src/modules/task/schema/task.schema";
@Schema({ timestamps: true })
export class User extends Document {
    @Prop()
    firstName: string;
    @Prop()
    lastName: string;
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' }) 
    profile: Profile; 
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }] }) 
    projects: Project[]; 
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref:'Team'}]})
    teams: Team[];
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Task'}] })
    tasks: Task[];
}
export const userSchema = SchemaFactory.createForClass(User);