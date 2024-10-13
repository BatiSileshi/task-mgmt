import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { commentSchema } from './schema/comment.schema';
import { taskSchema } from '../task/schema/task.schema';
import { projectSchema } from '../project/schema/project.schema';
import { CommentService } from './comment.service';
import { TaskService } from '../task/task.service';
import { ProjectService } from '../project/project.service';
import { CommentController } from './comment.controller';
import { listSchema } from '../list/schema/list.schema';
import { ListService } from '../list/list.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Comment', schema: commentSchema},
            {name: 'Task', schema: taskSchema},
            {name: 'Project', schema: projectSchema},
            {name: 'List', schema: listSchema},

        ])
    ],
    providers: [CommentService, TaskService, ProjectService, ListService],
    controllers: [CommentController],
    exports: [CommentService]
})
export class CommentsModule {}
