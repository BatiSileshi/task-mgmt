import { Document } from "mongoose";
export interface IsIssue extends Document {
    readonly title: string;
    readonly description: string;
    status: string;
    isArchived: boolean;
    raiser: string;
    project: string;
}