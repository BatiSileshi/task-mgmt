import { Document } from "mongoose";

export interface IsTask extends Document{
    readonly name: string;
    readonly description: string;
    readonly startDate: Date;
    readonly dueDate: Date;
    completedAt: Date;
    status: string;
    assignedTo: string;
    list: string;
    readonly comments?: Comment[];

}