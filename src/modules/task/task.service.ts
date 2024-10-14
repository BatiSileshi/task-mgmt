import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IsTask } from "./interface/task.interface";
import { ListService } from "../list/list.service";
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { Task } from "./schema/task.schema";

@Injectable()
export class TaskService{
    constructor(
        @InjectModel('Task')
        private taskModel: Model<IsTask>,
        private readonly listService: ListService
    ){}
    async createTask(createTaskDto: CreateTaskDto):Promise<IsTask>{
        const existingList = await this.listService.getList(createTaskDto.list);
        if (!existingList) {
          throw new NotFoundException('List not found.');
        }
        try{
            const task = await this.taskModel.create(createTaskDto);
            task.list=createTaskDto.list;
            existingList.tasks.push(task.id); 
            await existingList.save();
            return await task.save();

        }catch(error){
            console.log(error)
        }
    }
    async getTask(id: string){
        if(!id){
            return null;
        }
        const task = await this.taskModel.findById(id);
        if(!task){
            throw new NotFoundException("Task not found with this id.");
        }
        return task;
    }
    async getAllTasks():Promise<IsTask[]>{
        const tasks = await this.taskModel.find();
        if(!tasks){
            throw new NotFoundException('Tasks not found.')
        }
        return tasks;
    }
    async getTasksByList(id: string): Promise<IsTask[]> {
        const list = await this.listService.getList(id);
        if(!list){
            throw new NotFoundException("List not found")
        }
        const tasks = await this.taskModel.find({ list: id });
        if (!tasks || tasks.length === 0) {
          throw new NotFoundException('No tasks found for the list.');
        }
        return tasks;
      }
      
    async updateTask(updateTaskDto: UpdateTaskDto, ){
        const { id, ...taskData } = updateTaskDto;
        const task = await this.taskModel.findByIdAndUpdate(id, taskData, {new: true});
        return task;
    }
    async assignTask(assignTaskDto: AssignTaskDto){
        const { id, ...taskData } = assignTaskDto;
        const task = await this.taskModel.findByIdAndUpdate(id, taskData, {new: true});
        return task;
    }
    async archiveTask(@Body() archiveDto: ArchiveDto,  @CurrentUser() userInfo: User): Promise<Task>{
        return await this.taskModel.findByIdAndUpdate(
            archiveDto.id,
            {isArchived: true, deletedAt: new Date(), deletedBy: userInfo.id, archiveReason: archiveDto.archiveReason }, {new: true}
        )
    }
    async restoreTask(id: string): Promise<Task>{
        return await this.taskModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteTask(id: string): Promise<boolean> {
        await this.taskModel.findByIdAndDelete(id);
        return true;
    }
}