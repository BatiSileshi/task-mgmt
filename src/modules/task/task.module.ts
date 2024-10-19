import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { taskSchema } from './schema/task.schema';
import { listSchema } from '../list/schema/list.schema';
import { TaskService } from './task.service';
import { ListService } from '../list/list.service';
import { TaskController } from './task.controller';
import { ProjectService } from '../project/project.service';
import { projectSchema } from '../project/schema/project.schema';
import { EmailSender } from 'src/utils/emails/email';
import { userSchema } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { UtilFunctions } from 'src/utils/utils';
import { TeamService } from '../team/team.service';
import { teamSchema } from '../team/schema/team.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Task', schema: taskSchema},
            {name: 'List', schema: listSchema},
            {name: 'Project', schema: projectSchema},
            {name: 'User', schema: userSchema},
            {name: 'Team', schema: teamSchema},
        ])
    ],
    providers: [TaskService, ListService, ProjectService, EmailSender, UserService, 
        UtilFunctions, TeamService
    ],
    controllers: [TaskController],
    exports: [TaskService]
})
export class TaskModule {}
