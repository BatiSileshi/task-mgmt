import { Document } from "mongoose";

export interface IsTask extends Document{
    readonly name: string;
    readonly description: string;
    readonly startDate: string;
    readonly dueDate: string;
    assignedTo: string;
    list: string;
}