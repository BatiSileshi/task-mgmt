import { Injectable, CanActivate, ExecutionContext, BadRequestException, ForbiddenException } from "@nestjs/common";
import { ProjectService } from "src/modules/project/project.service";
@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.body.id;
    const currentUser = request.user;
    const project = await this.projectService.getProject(projectId)
    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 
    throw new ForbiddenException("You are not allowed to take this action.")
  }
} 

@Injectable()
export class ProjectOwnerDestroyGuard implements CanActivate {
  constructor(private projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const projectId = request.params.id;
    const currentUser = request.user;
    const project = await this.projectService.getProject(projectId)
    if (project.owner && currentUser && project.owner._id.toString() === currentUser.id) {
        return true;
    } 
    throw new ForbiddenException("You are not allowed to perform this action.")
  }
} 