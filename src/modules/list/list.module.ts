import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { listSchema } from './schema/list.schema';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ProjectService } from '../project/project.service';
import { projectSchema } from '../project/schema/project.schema';
import { teamSchema } from '../team/schema/team.schema';
import { TeamService } from '../team/team.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'List', schema: listSchema},
            { name: 'Project', schema: projectSchema},
            { name: 'Team', schema: teamSchema},

        ])
    ],
    providers: [ListService, ProjectService, TeamService],
    controllers: [ListController],
    exports: [ListService]
})
export class ListsModule {}
