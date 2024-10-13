import { Document } from "mongoose";

export interface IsTeam extends Document{
    readonly name: string;
    project: string;
    memebersIds: string[];
}