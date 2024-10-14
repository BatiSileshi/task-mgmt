import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Profile } from "./profile.schema";
import { Project } from "src/modules/project/schema/project.schema";
import { Team } from "src/modules/team/schema/team.schema";
import { Task } from "src/modules/task/schema/task.schema";
import { Document } from "mongoose";
@Schema({ timestamps: true })
export class User extends Document {
    @Prop()
    firstName: string;
    @Prop()
    lastName: string;
    @Prop({ unique: true })
    email: string;
    @Prop()
    phoneNumber: string;
    @Prop()
    jobTitle: string;
    @Prop()
    address: string;
    @Prop()
    role: string;
    @Prop()
    password: string;
    @Prop({ default: false })
    isArchived: boolean;
    @Prop()
    deletedAt: Date;
    @Prop()
    deletedBy: string;
    @Prop()
    archiveReason: string;
    // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Profile' }) 
    // profile: Profile; 
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Project' }] }) 
    projects: Project[]; 
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref:'Team'}]})
    teams: Team[];
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Task'}] })
    tasks: Task[];
    @Prop({ default: null })
    forgotPasswordToken: string;
}
const userSchema1 = SchemaFactory.createForClass(User);
userSchema1.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
});
export const userSchema = userSchema1;