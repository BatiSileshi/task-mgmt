import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { Team } from "src/modules/team/schema/team.schema";
import { List } from "src/modules/list/schema/list.schema";
import { Issue } from "src/modules/issue/schema/issue.schema";
@Schema({ timestamps: true })
export class Project {
    @Prop()
    name: string;
    @Prop()
    description: string;
    @Prop()
    startDate: Date;
    @Prop()
    dueDate: Date;
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Team', unique: true})
    team: Team;
    // project has many lists
    @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref:'List'}]})
    lists: List[];
    // project has many issues
    @Prop({ type: [{type: MongooseSchema.Types.ObjectId, ref: 'Issue'}]})
    issues: Issue[];

}
export const projectSchema = SchemaFactory.createForClass(Project);