import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IsProject } from "./interface/project.interface";
import { CreateProjectDto, UpdateProjectDto } from "./dto/project.dto";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { Project } from "./schema/project.schema";
import { CurrentUser } from "../user/decorator/user.decorator";

@Injectable()
export class ProjectService {
    constructor(
        @InjectModel('Project')
        private projectModel: Model<IsProject>,
    ){}
    async createProject(createProjectDto: CreateProjectDto, user: User):Promise<IsProject>{
        const project = await this.projectModel.create(createProjectDto);
        project.owner = user;
        return await project.save();
    }
    async getProject(id: string){
        if(!id){
            return null;
        }
        const project = await this.projectModel.findById(id);
        if(!project){
            throw new NotFoundException("Project not found with this id.");
        }
        return project;
    }
    async getAllProjects():Promise<IsProject[]>{
        const projects = await this.projectModel.find();
        if(!projects){
            throw new NotFoundException('Projects not found.')
        }
        return projects;
    }
    async updateProject(updateProjectDto: UpdateProjectDto, ){
        const { id, ...projectData } = updateProjectDto;
        const project = await this.projectModel.findByIdAndUpdate(id, projectData, {new: true});
        return project;
    }
    async archiveProject(@Body() archiveDto: ArchiveDto,  @CurrentUser() userInfo: User): Promise<Project>{
        // const { id, ...archiveData } = archiveDto;
        return await this.projectModel.findByIdAndUpdate(
            archiveDto.id,
            {isArchived: true, deletedAt: new Date(), deletedBy: userInfo.id, archiveReason: archiveDto.archiveReason }, {new: true}
        )
    }
    async restoreProject(id: string): Promise<Project>{
        return await this.projectModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteProject(id: string): Promise<boolean> {
        await this.projectModel.findByIdAndDelete(id);
        return true;
    }
    async findProjectsByUser(user: User, options?: any): Promise<IsProject[]> {
        const projects = await this.projectModel.find({ owner: user._id }, options).exec();
    
        if (!projects || projects.length === 0) {
          throw new NotFoundException('No projects found for the user.');
        }
    
        return projects;
    }
    async findProjectByUserAndTeam(user: User): Promise<IsProject[]> {
        const projects = await this.projectModel
          .find({
            team: {
              $elemMatch: {
                users: user._id, // This ensures that the team has this user
              },
            },
          })
          .populate({
            path: 'team',
            populate: {
              path: 'users', // Populate the users in the team
            },
          })
          .exec();
      
        if (!projects || projects.length === 0) {
          throw new NotFoundException('No projects found for the user in a team.');
        }
      
        return projects;
      }
      
}