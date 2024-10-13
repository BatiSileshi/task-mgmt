import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.schema';
import { listSchema } from '../list/schema/list.schema';
import { TaskService } from './task.service';
import { ListService } from '../list/list.service';
import { TaskController } from './task.controller';
import { ProjectService } from '../project/project.service';
import { projectSchema } from '../project/schema/project.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Task', schema: taskSchema},
            {name: 'List', schema: listSchema},
            {name: 'Project', schema: projectSchema}
        ])
    ],
    providers: [TaskService, ListService, ProjectService],
    controllers: [TaskController],
    exports: [TaskService]
})
export class TaskModule {}
