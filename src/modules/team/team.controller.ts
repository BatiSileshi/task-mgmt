import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TeamService } from "./team.service";
import { ProjectService } from "../project/project.service";
import { CreateTeamDto, UpdateTeamDto } from "./dto/team.dto";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { AuthGuard } from "src/utils/guards/user/auth.guard";
import { GetTeamAccessGuard, TeamGuard } from "src/utils/guards/team/team.guard";

@ApiTags('Teams')
@Controller('teams')
export class TeamController {
    constructor(
        private teamService: TeamService,
        private readonly projectService: ProjectService,
    ){}
    @Post('create-team')
    @ApiOperation({ summary: 'Create team for a project', description: 'A user can create team, iff he is owner the project.' })
    @UseGuards(AuthGuard, TeamGuard)
    async createTeam(
        @Body() body: CreateTeamDto,
    ){
        return await this.teamService.createTeam(body);
    }
    @Get('get-team/:id')
    @ApiOperation({ summary: 'Get single team'})
    @UseGuards(AuthGuard)
    async getTeam(@Param('id') id: string){
        return this.teamService.getTeam(id);
    }
    @Get('get-all-teams')
    @ApiOperation({ description: 'Get all teams' })
    @UseGuards(AuthGuard)
    async getTeams(){
        return this.teamService.getAllTeams();
    }
    @Get('get-project-teams/:id')
    @ApiOperation({ summary: 'Get teams of a project', description: 'A current user can see team, iff he is owner the project or in team of the project only.' })
    @UseGuards(AuthGuard, GetTeamAccessGuard)
    async getTeamsByProject(@Param('id') id: string) {
        const project = await this.projectService.getProject(id);
        if (!project) {
          throw new NotFoundException(`Project not found with this id.`);
        }
        const teams = await this.teamService.getTeamByProject(project.id);
        return teams;
      }
    @Put('update-team')
    @ApiOperation({ summary: 'Update a team', description: 'Current user can update a team iff he is owner of project.' })
    @UseGuards(AuthGuard, TeamGuard)
    async updateTeam(@Body() body: UpdateTeamDto){
        return await this.teamService.updateTeam(body);
    }
    @Delete('archive-team')
    @ApiOperation({summary: 'Archiving team'})
    @UseGuards(AuthGuard, TeamGuard)
    async archiveTeam(@Body() archiveTeam: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.teamService.archiveTeam(archiveTeam, userInfo);
    }
    @Put('restore-team/:id')
    @ApiOperation({summary: 'Restoring team'})
    @UseGuards(AuthGuard, TeamGuard)
    async restoreTeam(@Param('id') id: string){
        return await this.teamService.restoreTeam(id);
    }
    @Delete('delete-team/:id')
    @ApiOperation({summary: 'Deleting team'})
    @UseGuards(AuthGuard, TeamGuard)
    async deleteTeam(@Param('id') id: string){
        return await this.teamService.deleteTeam(id);
    }
}