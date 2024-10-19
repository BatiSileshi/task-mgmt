import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ListService } from "src/modules/list/list.service";
import { ProjectService } from "src/modules/project/project.service";
import { TaskService } from "src/modules/task/task.service";
import { TeamService } from "src/modules/team/team.service";


@Injectable()
export class CreateTaskGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly listService: ListService,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const listId = request.body.list;
 
    const list = await this.listService.getList(listId.toString());

    const projectId = list.project;
    const project = await this.projectService.getProject(projectId);

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    const teams = project.teams; 
    if (!teams || teams.length === 0) {
      throw new ForbiddenException('You do not have access to this project.');
    }

    for (const teamId of teams) {
      const team = await this.teamService.getTeam(teamId.toString());
      if (team && team.users.some((user) => user.toString() === currentUser.id.toString())) {
        return true;
      }
    }
    throw new ForbiddenException('You do not have access to this project.');
  }
}

@Injectable()
export class GetTaskGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly listService: ListService,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const listId = request.params.id;
 
    const list = await this.listService.getList(listId.toString());

    const projectId = list.project;
    const project = await this.projectService.getProject(projectId);

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    const teams = project.teams; 
    if (!teams || teams.length === 0) {
      throw new ForbiddenException('You do not have access to this project.');
    }

    for (const teamId of teams) {
      const team = await this.teamService.getTeam(teamId.toString());
      if (team && team.users.some((user) => user.toString() === currentUser.id.toString())) {
        return true;
      }
    }
    throw new ForbiddenException('You do not have access to this project.');
  }
}

@Injectable()
export class TaskAccessGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly listService: ListService,
    private readonly taskService: TaskService,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const taskId = request.body.id;
    const task = await this.taskService.getTask(taskId);

    const listId = task.list;
    const list = await this.listService.getList(listId.toString());

    const projectId = list.project;
    const project = await this.projectService.getProject(projectId);

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    const teams = project.teams; 
    if (!teams || teams.length === 0) {
      throw new ForbiddenException('You do not have access to this project.');
    }

    for (const teamId of teams) {
      const team = await this.teamService.getTeam(teamId.toString());
      if (team && team.users.some((user) => user.toString() === currentUser.id.toString())) {
        return true;
      }
    }
    throw new ForbiddenException('You do not have access to this project.');
  }
}

@Injectable()
export class TaskAccess2Guard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly listService: ListService,
    private readonly taskService: TaskService,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const taskId = request.params.id;
    const task = await this.taskService.getTask(taskId);

    const listId = task.list;
    const list = await this.listService.getList(listId.toString());

    const projectId = list.project;
    const project = await this.projectService.getProject(projectId);

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    const teams = project.teams; 
    if (!teams || teams.length === 0) {
      throw new ForbiddenException('You do not have access to this project.');
    }

    for (const teamId of teams) {
      const team = await this.teamService.getTeam(teamId.toString());
      if (team && team.users.some((user) => user.toString() === currentUser.id.toString())) {
        return true;
      }
    }
    throw new ForbiddenException('You do not have access to this project.');
  }
}

