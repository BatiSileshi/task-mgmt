import { Document } from "mongoose";

export interface IsComment extends Document{
    readonly comment: string;
    creator: string;
    task: string;
}