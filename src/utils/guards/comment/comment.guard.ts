import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { CommentService } from "src/modules/comment/comment.service";

@Injectable()
export class CommentOwnerGuard implements CanActivate{
    constructor(
        private commentService: CommentService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user; 
       const commentId = request.body.id;
       const comment = await this.commentService.getComment(commentId);
        if(comment && comment.creator.toString() === currentUser.id){
         return true;
       }
       throw new ForbiddenException('You are not allowed to perform this action.')
    }
}

@Injectable()
export class CommentOwner2Guard implements CanActivate{
    constructor(
        private commentService: CommentService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user; 
       const commentId = request.params.id;
       const comment = await this.commentService.getComment(commentId);
        if(comment && comment.creator.toString() === currentUser.id){
         return true;
       }
       throw new ForbiddenException('You are not allowed to perform this action.')
    }
}