import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IssueService } from "./issue.service";
import { ProjectService } from "../project/project.service";
import { CreateIssueDto, UpdateIssueDto, UpdateIssueStatusDto } from "./dto/issue.dto";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { AuthGuard } from "src/utils/guards/user/auth.guard";
import { GetIssueAccessGuard, IssueGuard, IssueOwner2Guard, IssueOwnerGuard } from "src/utils/guards/issue/issue.guard";

@ApiTags('Issues')
@Controller('issues')
export class IssueController {
    constructor(
        private issueService: IssueService,
        private readonly projectService: ProjectService,
    ){}
    @Post('create-issue')
    @ApiOperation({description: 'Raise issue on project'})
    @UseGuards(AuthGuard)
    async createIssue(
        @Body() body: CreateIssueDto,
        @CurrentUser() user: User,
    ){
        return await this.issueService.createIssue(body, user);
    }
    @Get('get-issue/:id')
    @ApiOperation({ summary: 'Get single issue'})
    @UseGuards(AuthGuard)
    async getIssue(@Param('id') id: string){
        return this.issueService.getIssue(id);
    }
    @Get('get-all-issues')
    @ApiOperation({ description: 'Get all issues' })
    @UseGuards(AuthGuard)
    async getIssues(){
        return this.issueService.getAllIssues();
    }
    @Get('get-project-issues/:id')
    @ApiOperation({ summary: 'Get issues of a project', description: 'If current user is memeber the team or owner the project.'})
    @UseGuards(AuthGuard, GetIssueAccessGuard)
    async getIssuesByProject(@Param('id') id: string) {
        const project = await this.projectService.getProject(id);
        if (!project) {
          throw new NotFoundException(`Project not found with this id.`);
        }
    
        const issues = await this.issueService.getIssuesByProject(project.id);
        return issues;
      }
    @Put('update-issue')
    @ApiOperation({ summary: 'Update a issue', description: 'Current user can update a issue if he/she is issue raiser..' })
    @UseGuards(AuthGuard, IssueOwnerGuard)
    async updateIssue(@Body() body: UpdateIssueDto){
        return await this.issueService.updateIssue(body);
    }
    @Put('update-issue-status')
    @ApiOperation({ summary: 'Update issue status', description: 'By project owner' })
    @UseGuards(AuthGuard, IssueGuard)
    async updateIssueStatus(@Body() body: UpdateIssueStatusDto){
        return await this.issueService.updateIssueStatus(body);
    }
    @Delete('archive-issue')
    @ApiOperation({summary: 'Archiving issue - by raiser'})
    @UseGuards(AuthGuard, IssueOwnerGuard)
    async archiveIssue(@Body() archiveIssue: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.issueService.archiveIssue(archiveIssue, userInfo);
    }
    @Put('restore-issue/:id')
    @ApiOperation({summary: 'Restoring issue - by raiser'})
    @UseGuards(AuthGuard, IssueOwner2Guard)
    async restoreIssue(@Param('id') id: string){
        return await this.issueService.restoreIssue(id);
    }
    @Delete('delete-issue/:id')
    @ApiOperation({summary: 'Deleting issue - by raiser'})
    @UseGuards(AuthGuard, IssueOwner2Guard)
    async deleteIssue(@Param('id') id: string){
        return await this.issueService.deleteIssue(id);
    }
}