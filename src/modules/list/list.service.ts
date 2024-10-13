import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { IsList } from "./interface/list.interface";
import { CreateListDto, UpdateListDto } from "./dto/list.dto";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { List } from "./schema/list.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Project } from "../project/schema/project.schema";
import { ProjectService } from "../project/project.service";

@Injectable()
export class ListService{
    constructor(
        @InjectModel('List')
        private listModel: Model<IsList>,
        private readonly projectService: ProjectService
    ){}
    async createList(createListDto: CreateListDto):Promise<IsList>{
        const existingProject = await this.projectService.getProject(createListDto.project);
        if (!existingProject) {
          throw new NotFoundException('Project not found.');
        }
        try{
            const list = await this.listModel.create(createListDto);
            list.project=createListDto.project;
            
            return await list.save();

        }catch(error){
            console.log(error)
        }
    }
    async getList(id: string){
        if(!id){
            return null;
        }
        const list = await this.listModel.findById(id);
        if(!list){
            throw new NotFoundException("List not found with this id.");
        }
        return list;
    }
    async getAllLists():Promise<IsList[]>{
        const lists = await this.listModel.find();
        if(!lists){
            throw new NotFoundException('Lists not found.')
        }
        return lists;
    }
    async getListByProject(id: string): Promise<IsList[]> {
        const project = await this.projectService.getProject(id);

        const lists = await this.listModel.find({ project: id });
        
        if (!lists || lists.length === 0) {
          throw new NotFoundException('No lists found for the project.');
        }
      
        return lists;
      }
      
    async updateList(updateListDto: UpdateListDto, ){
        const { id, ...listData } = updateListDto;
        const list = await this.listModel.findByIdAndUpdate(id, listData, {new: true});
        return list;
    }
    async archiveList(@Body() archiveDto: ArchiveDto,  @CurrentUser() userInfo: User): Promise<List>{
        return await this.listModel.findByIdAndUpdate(
            archiveDto.id,
            {isArchived: true, deletedAt: new Date(), deletedBy: userInfo.id, archiveReason: archiveDto.archiveReason }, {new: true}
        )
    }
    async restoreList(id: string): Promise<List>{
        return await this.listModel.findByIdAndUpdate(
            id,
            {isArchived: false, deletedAt: null, deletedBy: null}, {new: true}
        )
    }
    async deleteList(id: string): Promise<boolean> {
        await this.listModel.findByIdAndDelete(id);
        return true;
    }
}