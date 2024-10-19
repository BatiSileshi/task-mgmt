import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { issueSchema } from './schema/issue.schema';
import { projectSchema } from '../project/schema/project.schema';
import { IssueService } from './issue.service';
import { ProjectService } from '../project/project.service';
import { IssueController } from './issue.controller';
import { teamSchema } from '../team/schema/team.schema';
import { TeamService } from '../team/team.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: 'Issue', schema: issueSchema},
            {name: 'Project', schema: projectSchema},
            {name: 'Team', schema: teamSchema},

        ])
    ],
    providers: [IssueService, ProjectService, TeamService],
    controllers: [IssueController],
    exports: [IssueService]
})
export class IssuesModule {}
