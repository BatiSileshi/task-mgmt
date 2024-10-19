import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { AuthGuard } from "src/utils/guards/user/auth.guard";
import { CommentOwner2Guard, CommentOwnerGuard } from "src/utils/guards/comment/comment.guard";

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    constructor(
        private commentService: CommentService,
    ){}
    @Post('create-comment')
    @ApiOperation({description: 'Comment on task'})
    @UseGuards(AuthGuard)
    async createComment(
        @Body() body: CreateCommentDto,
        @CurrentUser() user: User,
    ){
        return await this.commentService.createComment(body, user);
    }
    @Get('get-comment/:id')
    @ApiOperation({ summary: 'Get single comment'})
    @UseGuards(AuthGuard)
    async getComment(@Param('id') id: string){
        return this.commentService.getComment(id);
    }
    @Get('get-all-comments')
    @ApiOperation({ description: 'Get all comments' })
    @UseGuards(AuthGuard)
    async getComments(){
        return this.commentService.getAllComments();
    }
    @Get('get-task-comments/:id')
    @ApiOperation({ summary: 'Get comments of a task', description: 'Can access if owner of the project or memeber the team.'})
    @UseGuards(AuthGuard)
    async getCommentsByTask(@Param('id') id: string) {
        const comments = await this.commentService.getCommentsByTask(id);
        return comments;
      }
    @Put('update-comment')
    @ApiOperation({ summary: 'Update a comment - by creator' })
    @UseGuards(AuthGuard, CommentOwnerGuard)
    async updateComment(@Body() body: UpdateCommentDto){
        return await this.commentService.updateComment(body);
    }
    @Delete('archive-comment')
    @ApiOperation({summary: 'Archiving comment - by creator'})
    @UseGuards(AuthGuard, CommentOwnerGuard)
    async archiveComment(@Body() archiveComment: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.commentService.archiveComment(archiveComment, userInfo);
    }
    @Put('restore-comment/:id')
    @ApiOperation({summary: 'Restoring comment - by creator'})
    @UseGuards(AuthGuard, CommentOwner2Guard)
    async restoreComment(@Param('id') id: string){
        return await this.commentService.restoreComment(id);
    }
    @Delete('delete-comment/:id')
    @ApiOperation({summary: 'Deleting comment - by creator'})
    @UseGuards(AuthGuard, CommentOwner2Guard)
    async deleteComment(@Param('id') id: string){
        return await this.commentService.deleteComment(id);
    }
}