import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
@Injectable()
export class EmailSender {
    constructor(
        private mailerService: MailerService,

    ){}

    async sendTaskAssignmentEmail(email: string, task: string, dueDate: Date): Promise<boolean> {
        try {
            const mailOptions = {
              to: email,
              subject: 'Task Assignment',
              html: `
              <p>Task ${task} has been assigned to you. The deadline is on ${dueDate}.</p>
              `,
            };
            await this.mailerService.sendMail(mailOptions);
            return true;
          } catch (error) {
            return false;
          }
    }

    async sendTaskUpdateEmail(email: string, task: string, list: string): Promise<boolean> {
        try {
            const mailOptions = {
              to: email,
              subject: 'Task Update',
              html: `
              <p>Task ${task} has been moved to list ${list}.</p>
              `,
            };
            await this.mailerService.sendMail(mailOptions);
            return true;
          } catch (error) {
            return false;
          }
      }
      async sendTaskCompleteEmail(email: string, task: string): Promise<boolean> {
        try {
            const mailOptions = {
              to: email,
              subject: 'Task Completed',
              html: `
              <p>Task ${task} is completed.</p>
              `,
            };
            await this.mailerService.sendMail(mailOptions);
            return true;
          } catch (error) {
            return false;
          }
      }
}
