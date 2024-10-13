import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ProjectService } from "./project.service";
import { AuthGuard } from "src/utils/guards/user/auth.guard";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { ProjectOwnerDestroyGuard, ProjectOwnerGuard } from "src/utils/guards/project/project.guard";

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
    constructor(
        private projectService: ProjectService,
    ){}
    @Post('create-project')
    @ApiOperation({description: 'Any authenticated user can create project.'})
    @UseGuards(AuthGuard)
    createProject(
        @Body() body: CreateProjectDto,
        @CurrentUser() userInfo: User
    ){
        return this.projectService.createProject(body, userInfo);
    }
    @Get('get-project/:id')
    @ApiOperation({ summary: 'Get single project'})
    @UseGuards(AuthGuard)
    async getProject(@Param('id') id: string){
        return this.projectService.getProject(id);
    }
    @Get('get-all-projects')
    @ApiOperation({ description: 'Get all projects' })
    @UseGuards(AuthGuard)
    async getProjects(){
        return this.projectService.getAllProjects();
    }
    @Get('get-my-projects')
    @ApiOperation({ description: 'Get all projects created by currently logged in user' })
    @UseGuards(AuthGuard)
    async getMyProjects(@CurrentUser() userInfo: User){
        return await this.projectService.findProjectsByUser(userInfo);
    }
    @Put('update-project')
    @ApiOperation({ summary: 'Update a project', description: 'Logged in user can update a project iff he is creator.' })
    @UseGuards(AuthGuard, ProjectOwnerGuard)
    async updateProject(@Body() body: UpdateProjectDto){
        return await this.projectService.updateProject(body);
    }
    @Delete('archive-project')
    @ApiOperation({summary: 'Archiving project (only by owner)'})
    @UseGuards(AuthGuard, ProjectOwnerGuard)
    async archiveProject(@Body() archiveProject: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.projectService.archiveProject(archiveProject, userInfo);
    }
    @Put('restore-project/:id')
    @ApiOperation({summary: 'Restoring project (only by owner)'})
    @UseGuards(AuthGuard, ProjectOwnerDestroyGuard)
    async restoreProject(@Param('id') id: string){
        return await this.projectService.restoreProject(id);
    }
    @Delete('delete-project/:id')
    @ApiOperation({summary: 'Deleting project (only by owner)'})
    @UseGuards(AuthGuard, ProjectOwnerDestroyGuard)
    async deleteProject(@Param('id') id: string){
        return await this.projectService.deleteProject(id);
    }
}