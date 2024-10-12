import { Document } from "mongoose";
import { Issue } from "src/modules/issue/schema/issue.schema";
import { List } from "src/modules/list/schema/list.schema";
import { Team } from "src/modules/team/schema/team.schema";
import { User } from "src/modules/user/schema/user.schema";
export interface IsProject extends Document{
    readonly name: string;
    readonly description: string;
    readonly startDate: Date;
    readonly dueDate: Date;
    readonly team?: Team;
    owner?: User;
    readonly lists?: List[];
    readonly issues?: Issue[];
}