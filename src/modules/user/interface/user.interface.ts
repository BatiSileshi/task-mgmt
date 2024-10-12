import { Document } from "mongoose";
import { Project } from "src/modules/project/schema/project.schema";
import { Task } from "src/modules/task/schema/task.schema";
import { Team } from "src/modules/team/schema/team.schema";
export interface IsUser extends Document {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly phoneNumber: string;
    readonly jobTitle: string;
    readonly address: string;
    readonly role: string;
    readonly password: string;
    readonly isArchived: boolean;
    readonly deletedAt?: Date;
    readonly deletedBy?: string;
    readonly archiveReason?: string;
    readonly projects?: Project[];
    readonly teams?: Team[];
    readonly tasks?: Task[];
}


export interface LoginUserInterface{
    accessToken: string
    refreshToken: string

}