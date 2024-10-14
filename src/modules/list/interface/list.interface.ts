import { Document } from "mongoose";
import { Project } from "src/modules/project/schema/project.schema";
import { Task } from "src/modules/task/schema/task.schema";
export interface IsList extends Document{
    name: string;
    project: string;
    tasks: Task[];
}