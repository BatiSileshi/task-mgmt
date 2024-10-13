import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IsTeam } from "./interface/team.interface";
import { CreateTeamDto, UpdateTeamDto } from "./dto/team.dto";
import { ProjectService } from "../project/project.service";
import { Team } from "./schema/team.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";

@Injectable()
export class TeamService {
    constructor(
        @InjectModel('Team')
        private teamModel: Model<IsTeam>,
        private readonly projectService: ProjectService,
    ){}
    async createTeam(createTeamDto: CreateTeamDto){
        const project = await this.projectService.getProject(createTeamDto.project);
        if(!project){
            throw new NotFoundException("No project found.")
        }
        const team = await this.teamModel.create(createTeamDto);
        team.project=createTeamDto.project;
        team.memebersIds=createTeamDto.membersIds;
        return await team.save();
    }
    //get team by project
    async getTeam(id: string){
        if(!id){
            return null;
        }
        const team = await this.teamModel.findById(id);
        if(!team){
            throw new NotFoundException("Team not found with this id.");
        }
        return team;
    }
    async getAllTeams():Promise<IsTeam[]>{
        const teams = await this.teamModel.find();
        if(!teams){
            throw new NotFoundException('Teams not found.')
        }
        return teams;
    }
    async getTeamByProject(id: string): Promise<IsTeam[]>{
        const project = await this.projectService.getProject(id);
        if(!project){
            throw new NotFoundException("No project found.")
        }
        const teams = await this.teamModel.find({ project: id });
        
        if (!teams || teams.length === 0) {
          throw new NotFoundException('No teams found for the project.');
        }
        return teams;
    }
      
    async updateTeam(updateTeamDto: UpdateTeamDto, ){
        const { id, ...teamData } = updateTeamDto;
        const team = await this.teamModel.findByIdAndUpdate(id, teamData, {new: true});
        return team;
    }
    async archiveTeam(@Body() archiveDto: ArchiveDto,  @CurrentUser() userInfo: User): Promise<Team>{
        return await this.teamModel.findByIdAndUpdate(
            archiveDto.id,
            {isArchived: true, deletedAt: new Date(), deletedBy: userInfo.id, archiveReason: archiveDto.archiveReason }, {new: true}
        )
    }
    async restoreTeam(id: string): Promise<Team>{
        return await this.teamModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteTeam(id: string): Promise<boolean> {
        await this.teamModel.findByIdAndDelete(id);
        return true;
    }
}