import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { teamSchema } from './schema/team.schema';
import { projectSchema } from '../project/schema/project.schema';
import { TeamService } from './team.service';
import { ProjectService } from '../project/project.service';
import { TeamController } from './team.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Team', schema: teamSchema},
            {name: 'Project', schema: projectSchema},
        ])
    ],
    providers: [TeamService, ProjectService],
    controllers: [TeamController],
    exports: [TeamService]
})
export class TeamModule {}
