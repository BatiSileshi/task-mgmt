import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
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
export class GetListAccessGuard implements CanActivate{
    constructor(
        private projectService: ProjectService,
        private teamService: TeamService 
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        const currentUser = request.user;
        const projectId = request.params.id;
        console.log("🚀 ~ GetListAccessGuard ~ canActivate ~ projectId:", projectId)
        const project = await this.projectService.getProject(projectId); 
        console.log("🚀 ~ GetListAccessGuard ~ canActivate ~ project:", project)
        if(!project){
            throw new NotFoundException('Project not found.')
        }
        if(project && project.owner.id === currentUser.id){
            return true;
        }

        const teamId = project.team.id;
        console.log("🚀 ~ GetListAccessGuard ~ canActivate ~ teamId:", teamId)
        const team = await this.teamService.getTeam(teamId);

        const isUserInTeam = team && team.users && team.users.some((teamUser) => teamUser === currentUser.id);


        if(isUserInTeam){
            return true;
        }
        return false;
    }
}
