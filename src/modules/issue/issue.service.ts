import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IsIssue } from "./interface/issue.interface";
import { ProjectService } from "../project/project.service";
import { CreateIssueDto, UpdateIssueDto } from "./dto/issue.dto";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { Issue } from "./schema/issue.schema";

@Injectable()
export class IssueService{
    constructor(
        @InjectModel('Issue')
        private issueModel: Model<IsIssue>,
        private readonly projectService: ProjectService
    ){}
    async createIssue(createIssueDto: CreateIssueDto, @CurrentUser() user: User):Promise<IsIssue>{
        const existingProject = await this.projectService.getProject(createIssueDto.project);
        if (!existingProject) {
          throw new NotFoundException('Project not found.');
        }
        try{
            const issue = await this.issueModel.create(createIssueDto);
            issue.project=createIssueDto.project;
            issue.raiser=user.id;
            return await issue.save();

        }catch(error){
            console.log(error)
        }
    }
    async getIssue(id: string){
        if(!id){
            return null;
        }
        const issue = await this.issueModel.findById(id);
        if(!issue){
            throw new NotFoundException("Issue not found with this id.");
        }
        return issue;
    }
    async getAllIssues():Promise<IsIssue[]>{
        const issues = await this.issueModel.find();
        if(!issues){
            throw new NotFoundException('Issues not found.')
        }
        return issues;
    }
    async getIssuesByProject(id: string): Promise<IsIssue[]> {
        const project = await this.projectService.getProject(id);

        const issues = await this.issueModel.find({ project: id });
        
        if (!issues || issues.length === 0) {
          throw new NotFoundException('No issues found for the project.');
        }
      
        return issues;
      }
      
    async updateIssue(updateIssueDto: UpdateIssueDto, ){
        const { id, ...issueData } = updateIssueDto;
        const issue = await this.issueModel.findByIdAndUpdate(id, issueData, {new: true});
        return issue;
    }
    async archiveIssue(@Body() archiveDto: ArchiveDto,  @CurrentUser() userInfo: User): Promise<Issue>{
        return await this.issueModel.findByIdAndUpdate(
            archiveDto.id,
            {isArchived: true, deletedAt: new Date(), deletedBy: userInfo.id, archiveReason: archiveDto.archiveReason }, {new: true}
        )
    }
    async restoreIssue(id: string): Promise<Issue>{
        return await this.issueModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteIssue(id: string): Promise<boolean> {
        await this.issueModel.findByIdAndDelete(id);
        return true;
    }
}