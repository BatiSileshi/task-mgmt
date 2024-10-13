import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { AssignTaskDto, CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { AuthGuard } from "src/utils/guards/user/auth.guard";

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
    constructor(
        private taskService: TaskService,
    ){}
    @Post('create-task')
    @ApiOperation({description: 'Create task for project'})
    @UseGuards(AuthGuard)
    async createTask(
        @Body() body: CreateTaskDto,
    ){
        return await this.taskService.createTask(body);
    }
    @Get('get-task/:id')
    @ApiOperation({ summary: 'Get single task'})
    @UseGuards(AuthGuard)
    async getTask(@Param('id') id: string){
        return this.taskService.getTask(id);
    }
    @Get('get-all-tasks')
    @ApiOperation({ description: 'Get all tasks' })
    @UseGuards(AuthGuard)
    async getTasks(){
        return this.taskService.getAllTasks();
    }
    @Get('get-project-tasks/:id')
    @ApiOperation({ summary: 'Get tasks of a list'})
    @UseGuards(AuthGuard)
    async getTasksByList(@Param('id') id: string) {
        const tasks = await this.taskService.getTasksByList(id);
        return tasks;
      }
    @Put('update-task')
    @ApiOperation({ summary: 'Update a task'})
    @UseGuards(AuthGuard)
    async updateTask(@Body() body: UpdateTaskDto){
        return await this.taskService.updateTask(body);
    }
    @Put('assign-task')
    @ApiOperation({ summary: 'Assign a task', description: '.....' })
    @UseGuards(AuthGuard)
    async assignTask(@Body() body: AssignTaskDto){
        return await this.taskService.assignTask(body);
    }
    @Delete('archive-task')
    @ApiOperation({summary: 'Archiving task '})
    @UseGuards(AuthGuard)
    async archiveTask(@Body() archiveTask: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.taskService.archiveTask(archiveTask, userInfo);
    }
    @Put('restore-task/:id')
    @ApiOperation({summary: 'Restoring task'})
    @UseGuards(AuthGuard)
    async restoreTask(@Param('id') id: string){
        return await this.taskService.restoreTask(id);
    }
    @Delete('delete-task/:id')
    @ApiOperation({summary: 'Deleting task'})
    @UseGuards(AuthGuard)
    async deleteTask(@Param('id') id: string){
        return await this.taskService.deleteTask(id);
    }
}