import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
    constructor(
        private taskService: TaskService,
    ){}
    @Post('create-task')
    @ApiOperation({description: 'Project owner can create task.'})
    // @UseGuards(AuthGuard)
    async createTask(
        @Body() body: CreateTaskDto,
    ){
        return await this.taskService.createTask(body);
    }
    @Get('get-task/:id')
    @ApiOperation({ summary: 'Get single task'})
    // @UseGuards(AuthGuard, TaskGuard)
    async getTask(@Param('id') id: string){
        return this.taskService.getTask(id);
    }
    @Get('get-all-tasks')
    @ApiOperation({ description: 'Get all tasks' })
    // @UseGuards(AuthGuard)
    async getTasks(){
        return this.taskService.getAllTasks();
    }
    @Get('get-project-tasks/:id')
    @ApiOperation({ summary: 'Get tasks of a project', description: 'A current user can see task, iff he is owner the project and in team of the project only.' })
    // @UseGuards(AuthGuard, GetTaskAccessGuard)
    async getTasksByList(@Param('id') id: string) {
        const tasks = await this.taskService.getTasksByList(id);
        return tasks;
      }
    @Put('update-task')
    @ApiOperation({ summary: 'Update a task', description: 'Current user can update a task iff he is owner of project.' })
    // @UseGuards(AuthGuard, TaskGuard)
    async updateTask(@Body() body: UpdateTaskDto){
        return await this.taskService.updateTask(body);
    }
    @Put('assign-task')
    @ApiOperation({ summary: 'Assign a task', description: '.....' })
    // @UseGuards(AuthGuard, TaskGuard)
    async assignTask(@Body() body: AssignTaskDto){
        return await this.taskService.assignTask(body);
    }
    @Delete('archive-task')
    @ApiOperation({summary: 'Archiving task (only by project owner)'})
    // @UseGuards(AuthGuard, TaskGuard)
    async archiveTask(@Body() archiveTask: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.taskService.archiveTask(archiveTask, userInfo);
    }
    @Put('restore-task/:id')
    @ApiOperation({summary: 'Restoring task'})
    // @UseGuards(AuthGuard, TaskGuard)
    async restoreTask(@Param('id') id: string){
        return await this.taskService.restoreTask(id);
    }
    @Delete('delete-task/:id')
    @ApiOperation({summary: 'Deleting task'})
    // @UseGuards(AuthGuard, TaskGuard)
    async deleteTask(@Param('id') id: string){
        return await this.taskService.deleteTask(id);
    }
}