import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CommentService } from "./comment.service";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { CreateCommentDto, UpdateCommentDto } from "./dto/comment.dto";
import { ArchiveDto } from "src/utils/dtos/archive.dto";

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    constructor(
        private commentService: CommentService,
    ){}
    @Post('create-comment')
    @ApiOperation({description: 'Project owner can create comment.'})
    // @UseGuards(AuthGuard)
    async createComment(
        @Body() body: CreateCommentDto,
        @CurrentUser() user: User,
    ){
        return await this.commentService.createComment(body, user);
    }
    @Get('get-comment/:id')
    @ApiOperation({ summary: 'Get single comment'})
    // @UseGuards(AuthGuard, CommentGuard)
    async getComment(@Param('id') id: string){
        return this.commentService.getComment(id);
    }
    @Get('get-all-comments')
    @ApiOperation({ description: 'Get all comments' })
    // @UseGuards(AuthGuard)
    async getComments(){
        return this.commentService.getAllComments();
    }
    @Get('get-project-comments/:id')
    @ApiOperation({ summary: 'Get comments of a project', description: 'A current user can see comment, iff he is owner the project and in team of the project only.' })
    // @UseGuards(AuthGuard, GetCommentAccessGuard)
    async getCommentsByTask(@Param('id') id: string) {
        const comments = await this.commentService.getCommentsByTask(id);
        return comments;
      }
    @Put('update-comment')
    @ApiOperation({ summary: 'Update a comment', description: 'Current user can update a comment iff he is owner of project.' })
    // @UseGuards(AuthGuard, CommentGuard)
    async updateComment(@Body() body: UpdateCommentDto){
        return await this.commentService.updateComment(body);
    }
    @Delete('archive-comment')
    @ApiOperation({summary: 'Archiving comment (only by owner)'})
    // @UseGuards(AuthGuard, CommentGuard)
    async archiveComment(@Body() archiveComment: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.commentService.archiveComment(archiveComment, userInfo);
    }
    @Put('restore-comment/:id')
    @ApiOperation({summary: 'Restoring comment'})
    // @UseGuards(AuthGuard, CommentGuard)
    async restoreComment(@Param('id') id: string){
        return await this.commentService.restoreComment(id);
    }
    @Delete('delete-comment/:id')
    @ApiOperation({summary: 'Deleting comment'})
    // @UseGuards(AuthGuard, CommentGuard)
    async deleteComment(@Param('id') id: string){
        return await this.commentService.deleteComment(id);
    }
}