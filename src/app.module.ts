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
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './modules/user/auth/auth.service';
import { UtilFunctions } from './utils/utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env', 
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USERNAME')}:${configService.get('DB_PASSWORD')}@taskmgmtcluster.s5z2a.mongodb.net/?retryWrites=true&w=majority&appName=TaskMgmtCluster`,
      }),
    }),
    MongooseModule.forFeature([
      {name: 'User', schema: userSchema},
      {name: 'Comment', schema: commentSchema},
      {name: 'Issue', schema: issueSchema},
      {name: 'List', schema: listSchema},
      {name: 'Project', schema: projectSchema},
      {name: 'Task', schema: taskSchema},
      {name: 'Team', schema: teamSchema},
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
      }),

      inject: [ConfigService],
    }),

    UsersModule, ProjectsModule, CommentsModule, ListsModule, IssuesModule, TaskModule, TeamModule],
  controllers: [AppController],
  providers: [AppService, AuthService, UtilFunctions],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
          .apply(AuthMiddleware)
          .forRoutes('*'); 
  }
}
