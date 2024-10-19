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
export class GetTeamAccessGuard implements CanActivate {
  constructor(
    private readonly projectService: ProjectService,
    private readonly teamService: TeamService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const currentUser = request.user;
    const projectId = request.params.id;

    const project = await this.projectService.getProject(projectId);
    console.log("🚀 ~ GetTeamAccessGuard ~ canActivate ~ project:", project)

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 

    const teams = project.teams; 
    if (!teams || teams.length === 0) {
      throw new ForbiddenException('You do not have access to this project team.');
    }

    for (const teamId of teams) {
      const team = await this.teamService.getTeam(teamId.toString());
      if (team && team.users.some((user) => user.toString() === currentUser.id.toString())) {
        return true;
      }
    }
    throw new ForbiddenException('You do not have access to this project team.');
  }
}

