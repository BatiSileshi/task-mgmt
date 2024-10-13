import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { listSchema } from './schema/list.schema';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { ProjectService } from '../project/project.service';
import { projectSchema } from '../project/schema/project.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'List', schema: listSchema},
            { name: 'Project', schema: projectSchema},
        ])
    ],
    providers: [ListService, ProjectService],
    controllers: [ListController],
    exports: [ListService]
})
export class ListsModule {}
