import { CanActivate, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common";
import { IssueService } from "src/modules/issue/issue.service";
import { ProjectService } from "src/modules/project/project.service";

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
        console.log("🚀 ~ IssueGuard ~ canActivate ~ exproject:", exproject.owner)
        if(exproject && exproject.owner.id.toString() === currentUser.id){
         return true;
       }
       return false;
    }
}