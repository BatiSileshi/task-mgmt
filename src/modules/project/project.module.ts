import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { projectSchema } from './schema/project.schema';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Project', schema: projectSchema }]),
    ],
    providers: [ProjectService],
    controllers: [ProjectController],
    exports: [ProjectService]
})
export class ProjectsModule {}
