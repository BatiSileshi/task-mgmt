import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/utils/guards/auth.guard";
import { ListService } from "./list.service";
import { CreateListDto, UpdateListDto } from "./dto/list.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { ProjectService } from "../project/project.service";
@ApiTags('Lists')
@Controller('lists')
export class ListController {
    constructor(
        private listService: ListService,
        private readonly projectService: ProjectService,
    ){}
    @Post('create-list')
    @ApiOperation({description: 'Project owner can create list.'})
    // @UseGuards(AuthGuard)
    async createList(
        @Body() body: CreateListDto,
    ){
        return await this.listService.createList(body);
    }
    @Get('get-list/:id')
    @ApiOperation({ summary: 'Get single list'})
    // @UseGuards(AuthGuard, ListGuard)
    async getList(@Param('id') id: string){
        return this.listService.getList(id);
    }
    @Get('get-all-lists')
    @ApiOperation({ description: 'Get all lists' })
    // @UseGuards(AuthGuard)
    async getLists(){
        return this.listService.getAllLists();
    }
    @Get('get-project-lists/:id')
    @ApiOperation({ summary: 'Get lists of a project', description: 'A current user can see list, iff he is owner the project and in team of the project only.' })
    // @UseGuards(AuthGuard, GetListAccessGuard)
    async getListsByProject(@Param('id') id: string) {
        const project = await this.projectService.getProject(id);
        if (!project) {
          throw new NotFoundException(`Project not found with this id.`);
        }
    
        const lists = await this.listService.getListByProject(project.id);
        return lists;
      }
    @Put('update-list')
    @ApiOperation({ summary: 'Update a list', description: 'Current user can update a list iff he is owner of project.' })
    // @UseGuards(AuthGuard, ListGuard)
    async updateList(@Body() body: UpdateListDto){
        return await this.listService.updateList(body);
    }
    @Delete('archive-list')
    @ApiOperation({summary: 'Archiving list (only by owner)'})
    // @UseGuards(AuthGuard, ListGuard)
    async archiveList(@Body() archiveList: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.listService.archiveList(archiveList, userInfo);
    }
    @Put('restore-list/:id')
    @ApiOperation({summary: 'Restoring list'})
    // @UseGuards(AuthGuard, ListGuard)
    async restoreList(@Param('id') id: string){
        return await this.listService.restoreList(id);
    }
    @Delete('delete-list/:id')
    @ApiOperation({summary: 'Deleting list'})
    // @UseGuards(AuthGuard, ListGuard)
    async deleteList(@Param('id') id: string){
        return await this.listService.deleteList(id);
    }
}