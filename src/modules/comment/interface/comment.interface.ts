import { Document } from "mongoose";

export interface IsComment extends Document{
    comment: string;
    creator: string;
    task: string;
}