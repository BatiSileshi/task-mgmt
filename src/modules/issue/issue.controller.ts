import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IssueService } from "./issue.service";
import { ProjectService } from "../project/project.service";
import { CreateIssueDto, UpdateIssueDto } from "./dto/issue.dto";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";

@ApiTags('Issues')
@Controller('issues')
export class IssueController {
    constructor(
        private issueService: IssueService,
        private readonly projectService: ProjectService,
    ){}
    @Post('create-issue')
    @ApiOperation({description: 'Project owner can create issue.'})
    // @UseGuards(AuthGuard)
    async createIssue(
        @Body() body: CreateIssueDto,
        @CurrentUser() user: User,
    ){
        return await this.issueService.createIssue(body, user);
    }
    @Get('get-issue/:id')
    @ApiOperation({ summary: 'Get single issue'})
    // @UseGuards(AuthGuard, IssueGuard)
    async getIssue(@Param('id') id: string){
        return this.issueService.getIssue(id);
    }
    @Get('get-all-issues')
    @ApiOperation({ description: 'Get all issues' })
    // @UseGuards(AuthGuard)
    async getIssues(){
        return this.issueService.getAllIssues();
    }
    @Get('get-project-issues/:id')
    @ApiOperation({ summary: 'Get issues of a project', description: 'A current user can see issue, iff he is owner the project and in team of the project only.' })
    // @UseGuards(AuthGuard, GetIssueAccessGuard)
    async getIssuesByProject(@Param('id') id: string) {
        const project = await this.projectService.getProject(id);
        if (!project) {
          throw new NotFoundException(`Project not found with this id.`);
        }
    
        const issues = await this.issueService.getIssuesByProject(project.id);
        return issues;
      }
    @Put('update-issue')
    @ApiOperation({ summary: 'Update a issue', description: 'Current user can update a issue iff he is owner of project.' })
    // @UseGuards(AuthGuard, IssueGuard)
    async updateIssue(@Body() body: UpdateIssueDto){
        return await this.issueService.updateIssue(body);
    }
    @Delete('archive-issue')
    @ApiOperation({summary: 'Archiving issue (only by owner)'})
    // @UseGuards(AuthGuard, IssueGuard)
    async archiveIssue(@Body() archiveIssue: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.issueService.archiveIssue(archiveIssue, userInfo);
    }
    @Put('restore-issue/:id')
    @ApiOperation({summary: 'Restoring issue'})
    // @UseGuards(AuthGuard, IssueGuard)
    async restoreIssue(@Param('id') id: string){
        return await this.issueService.restoreIssue(id);
    }
    @Delete('delete-issue/:id')
    @ApiOperation({summary: 'Deleting issue'})
    // @UseGuards(AuthGuard, IssueGuard)
    async deleteIssue(@Param('id') id: string){
        return await this.issueService.deleteIssue(id);
    }
}