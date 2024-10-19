import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { IssueService } from "src/modules/issue/issue.service";
import { ProjectService } from "src/modules/project/project.service";
import { TeamService } from "src/modules/team/team.service";

@Injectable()
export class IssueGuard implements CanActivate{
    constructor(
        private projectService: ProjectService,
        private issueService: IssueService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user; 
       const issueId = request.body.id;
       const issue = await this.issueService.getIssue(issueId);
       if(!issue){
        throw new NotFoundException("Issue not found.")
       }
       const project = issue.project;
       const exproject = await this.projectService.getProject(project);
        if(exproject && exproject.owner.id.toString() === currentUser.id){
         return true;
       }
       return false;
    }
}


@Injectable()
export class GetIssueAccessGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const projectId = request.params.id;

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
export class IssueOwnerGuard implements CanActivate{
    constructor(
        private issueService: IssueService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user; 
       const issueId = request.body.id;
       const issue = await this.issueService.getIssue(issueId);
        if(issue && issue.raiser.toString() === currentUser.id){
         return true;
       }
       throw new ForbiddenException('You are not allowed to perform this action.')
    }
}

@Injectable()
export class IssueOwner2Guard implements CanActivate{
    constructor(
        private issueService: IssueService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
       const request = context.switchToHttp().getRequest();
       const currentUser = request.user; 
       const issueId = request.params.id;
       const issue = await this.issueService.getIssue(issueId);
        if(issue && issue.raiser.toString() === currentUser.id){
         return true;
       }
       return false;
    }
}