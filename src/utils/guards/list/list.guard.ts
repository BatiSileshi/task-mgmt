import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { ListService } from "src/modules/list/list.service";
import { List } from "src/modules/list/schema/list.schema";
import { ProjectService } from "src/modules/project/project.service";
import { TeamService } from "src/modules/team/team.service";

@Injectable()
export class ListGuard implements CanActivate{
    constructor(
        private projectService: ProjectService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user;
       const projectId = request.body.project;
       const project = await this.projectService.getProject(projectId);
       if(!project){
        throw new NotFoundException("Project not found.")
       } 
       if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
        } 
       throw new ForbiddenException("You are not allowed to perform this action.")
    }
}

@Injectable()
export class GetListAccessGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const projectId = request.params.id;

    const project = await this.projectService.getProject(projectId);

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    // Check if the current user is part of any team for the project
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
export class UpdateArchiveListGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly listService: ListService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const listId = request.body.id;
    const list = await this.listService.getList(listId);
    const projectId = list.project;
    const project = await this.projectService.getProject(projectId);

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    // Check if the current user is part of any team for the project
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
export class RestoreDeleteListGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
    private readonly listService: ListService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const listId = request.params.id;
    const list = await this.listService.getList(listId);
    const projectId = list.project;
    const project = await this.projectService.getProject(projectId);

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    // Check if the current user is part of any team for the project
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