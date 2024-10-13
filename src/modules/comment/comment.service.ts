import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IsComment } from "./interface/comment.interface";
import { TaskService } from "../task/task.service";
import { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";

@Injectable()
export class CommentService{
    constructor(
        @InjectModel('Comment')
        private commentModel: Model<IsComment>,
        private readonly taskService: TaskService
    ){}
    async createComment(createCommentDto: CreateCommentDto, @CurrentUser() user: User):Promise<IsComment>{
        const existingTask = await this.taskService.getTask(createCommentDto.task);
        if (!existingTask) {
          throw new NotFoundException('Task not found.');
        }
        try{
            const comment = await this.commentModel.create(createCommentDto);
            comment.task=createCommentDto.task;
            comment.creator=user.id;
            return await comment.save();

        }catch(error){
            console.log(error)
        }
    }
    async getComment(id: string){
        if(!id){
            return null;
        }
        const comment = await this.commentModel.findById(id);
        if(!comment){
            throw new NotFoundException("Comment not found with this id.");
        }
        return comment;
    }
    async getAllComments():Promise<IsComment[]>{
        const comments = await this.commentModel.find();
        if(!comments){
            throw new NotFoundException('Comments not found.')
        }
        return comments;
    }
    async getCommentsByTask(id: string): Promise<IsComment[]> {
        const task = await this.taskService.getTask(id);
        if(!task){
            throw new NotFoundException("Task not found.")
        }
        const comments = await this.commentModel.find({ task: id });
        
        if (!comments || comments.length === 0) {
          throw new NotFoundException('No comments found for the task.');
        }
        return comments;
      }
      
    async updateComment(updateCommentDto: UpdateCommentDto, ){
        const { id, ...commentData } = updateCommentDto;
        const comment = await this.commentModel.findByIdAndUpdate(id, commentData, {new: true});
        return comment;
    }
    async archiveComment(@Body() archiveDto: ArchiveDto,  @CurrentUser() userInfo: User): Promise<Comment>{
        return await this.commentModel.findByIdAndUpdate(
            archiveDto.id,
            {isArchived: true, deletedAt: new Date(), deletedBy: userInfo.id, archiveReason: archiveDto.archiveReason }, {new: true}
        )
    }
    async restoreComment(id: string): Promise<Comment>{
        return await this.commentModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteComment(id: string): Promise<boolean> {
        await this.commentModel.findByIdAndDelete(id);
        return true;
    }
}