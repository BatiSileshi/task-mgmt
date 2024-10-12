import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Team } from "src/modules/team/schema/team.schema";
import { List } from "src/modules/list/schema/list.schema";
import { Issue } from "src/modules/issue/schema/issue.schema";
import { Document } from "mongoose";
import { User } from "src/modules/user/schema/user.schema";

@Schema({ timestamps: true })
export class Project extends Document{
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    startDate: Date;
    @Prop()
    dueDate: Date;
    @Prop({ default: false })
    isArchived: boolean;
    @Prop()
    deletedAt: Date;
    @Prop()
    deletedBy: string;
    @Prop()
    archiveReason: string;
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Team' }] })
    teams: Team[];
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    owner: User;
    // project has many lists
    @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref:'List'}]})
    lists: List[];
    // project has many issues
    @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref: 'Issue'}]})
    issues: Issue[];

}
export const projectSchema = SchemaFactory.createForClass(Project);