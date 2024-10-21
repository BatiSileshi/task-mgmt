import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { TaskService } from "./task.service";
import { AssignTaskDto, CompleteTaskDto, CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";
import { CurrentUser } from "../user/decorator/user.decorator";
import { User } from "../user/schema/user.schema";
import { ArchiveDto } from "src/utils/dtos/archive.dto";
import { AuthGuard } from "src/utils/guards/user/auth.guard";
import { CreateTaskGuard, GetTaskGuard, TaskAccess2Guard, TaskAccessGuard } from "src/utils/guards/task/task.guard";

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
    constructor(
        private taskService: TaskService,
    ){}
    @Post('create-task')
    @ApiOperation({description: 'Create task for project'})
    @UseGuards(AuthGuard, CreateTaskGuard)
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
    @Get('get-list-tasks/:id')
    @ApiOperation({ summary: 'Get tasks of a list'})
    @UseGuards(AuthGuard, GetTaskGuard)
    async getTasksByList(@Param('id') id: string) {
        const tasks = await this.taskService.getTasksByList(id);
        return tasks;
      }
    @Get('get-assigned-tasks')
    @ApiOperation({ summary: 'Get assigned tasks to current user.'})
    @UseGuards(AuthGuard)
    async getAssignedTask(@CurrentUser() user: User){
        return await this.taskService.getAssignedTask(user.id);
    }
    @Get('/dashboard')
    @ApiOperation({ summary: 'Get report of assigned tasks, task completion rate and overdue tasks.'})
    @UseGuards(AuthGuard)
    async getUserDashboard(@CurrentUser() user: User): Promise<any> {
        const userTasks = await this.taskService.getAssignedTask(user.id);
        const taskCompletionRate = await this.taskService.calculateCompletionRate(user.id);
        const overdueTasks = await this.taskService.getOverdueTasks(user.id);
        return { taskCompletionRate, overdueTasks, tasks: userTasks };
    }    
    @Put('update-task')
    @ApiOperation({ summary: 'Update a task'})
    @UseGuards(AuthGuard, TaskAccessGuard)
    async updateTask(@Body() body: UpdateTaskDto){
        return await this.taskService.updateTask(body);
    }
    @Put('assign-task')
    @ApiOperation({ summary: 'Assign a task' })
    @UseGuards(AuthGuard, TaskAccessGuard)
    async assignTask(@Body() body: AssignTaskDto){
        return await this.taskService.assignTask(body);
    }
    @Put('complete-task')
    @ApiOperation({ summary: 'Complete a task' })
    @UseGuards(AuthGuard, TaskAccessGuard)
    async completeTask(@Body() body: CompleteTaskDto){
        return await this.taskService.completeTask(body);
    }
    @Delete('archive-task')
    @ApiOperation({summary: 'Archiving task '})
    @UseGuards(AuthGuard, TaskAccessGuard)
    async archiveTask(@Body() archiveTask: ArchiveDto, @CurrentUser() userInfo: User){
        return await this.taskService.archiveTask(archiveTask, userInfo);
    }
    @Put('restore-task/:id')
    @ApiOperation({summary: 'Restoring task'})
    @UseGuards(AuthGuard, TaskAccess2Guard)
    async restoreTask(@Param('id') id: string){
        return await this.taskService.restoreTask(id);
    }
    @Delete('delete-task/:id')
    @ApiOperation({summary: 'Deleting task'})
    @UseGuards(AuthGuard, TaskAccess2Guard)
    async deleteTask(@Param('id') id: string){
        return await this.taskService.deleteTask(id);
    }
}