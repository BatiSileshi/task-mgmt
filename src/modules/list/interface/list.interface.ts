import { Document } from "mongoose";
import { Project } from "src/modules/project/schema/project.schema";
export interface IsList extends Document{
    name: string;
    project: string;
}