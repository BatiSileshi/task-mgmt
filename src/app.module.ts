import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { userSchema } from './modules/user/schema/user.schema';
import { commentSchema } from './modules/comment/schema/comment.schema';
import { issueSchema } from './modules/issue/schema/issue.schema';
import { listSchema } from './modules/list/schema/list.schema';
import { projectSchema } from './modules/project/schema/project.schema';
import { taskSchema } from './modules/task/schema/task.schema';
import { teamSchema } from './modules/team/schema/team.schema';
import { AuthMiddleware } from './modules/user/auth/auth.middleware';

@Module({
  imports: [
    MongooseModule.forRoot(
      // `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@taskmgmtcluster.h3ynm.mongodb.net/?retryWrites=true&w=majority&appName=TaskMgmtCluster`
      'mongodb+srv://batyjio:X4yamlPBBj25FSwE@taskmgmtcluster.h3ynm.mongodb.net/?retryWrites=true&w=majority&appName=TaskMgmtCluster'
    ),
    MongooseModule.forFeature([
      {name: 'User', schema: userSchema},
      {name: 'Comment', schema: commentSchema},
      {name: 'Issue', schema: issueSchema},
      {name: 'List', schema: listSchema},
      {name: 'Project', schema: projectSchema},
      {name: 'Task', schema: taskSchema},
      {name: 'Team', schema: teamSchema},
    ]),
    UsersModule, ProjectsModule, CommentsModule, ListsModule, IssuesModule, TaskModule, TeamModule],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {
//   configure(consumer: MiddlewareConsumer){
//     consumer.apply(AuthMiddleware).forRoutes(
//       {path: '*',method: RequestMethod.POST},
//       {path: '*',method: RequestMethod.GET},
//       {path: '*',method: RequestMethod.PATCH},
//       {path: '*',method: RequestMethod.DELETE}
//       )
//   }
// }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(AuthMiddleware)
          .forRoutes('*'); // Apply to all routes or specify your routes
  }
}
