import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/user/user.module';
import { ProjectsModule } from './modules/project/project.module';
import { CommentsModule } from './modules/comment/comment.module';
import { ListsModule } from './modules/list/list.module';
import { IssuesModule } from './modules/issue/issue.module';
import { TaskModule } from './modules/task/task.module';
import { TeamModule } from './modules/team/team.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://batyjio:X4yamlPBBj25FSwE@taskmgmtcluster.h3ynm.mongodb.net/?retryWrites=true&w=majority&appName=TaskMgmtCluster'
    ),
    // MongooseModule.forFeature([
    //   {name: ''}
    // ])
    UsersModule, ProjectsModule, CommentsModule, ListsModule, IssuesModule, TaskModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// mongodb+srv://batyjio:<db_password>@taskmgmtcluster.h3ynm.mongodb.net/?retryWrites=true&w=majority&appName=TaskMgmtCluster
//db_password=X4yamlPBBj25FSwE