import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ProjectService } from "src/modules/project/project.service";
import { TeamService } from "src/modules/team/team.service";
@Injectable()
export class TeamGuard implements CanActivate{
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
export class Team1Guard implements CanActivate{
    constructor(
        private projectService: ProjectService,
        // private teamsService: TeamsService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user; 
       const projectId = request.params.id;
       const project = await this.projectService.getProject(projectId);
       if(!project){
        throw new NotFoundException("Project not found.")
       }
       if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
       } 
        throw new ForbiddenException("You are not allowed to take this action.")
    }
}