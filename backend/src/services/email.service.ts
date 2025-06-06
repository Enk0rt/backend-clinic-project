import fs from "node:fs/promises";
import path from "node:path";

import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";

import { config } from "../configs/config";
import { IEmailData } from "../constants/email.constants";

class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASSWORD,
            },
        });
    }

    public async sendMail(
        to: string,
        emailData: IEmailData,
        context: Record<string, any>,
    ) {
        await this.transporter.sendMail({
            to,
            subject: emailData.subject,
            html: await this._renderTemplate(emailData.template, context),
        });
    }

    private async _renderTemplate(
        templateName: string,
        context: Record<string, string>,
    ): Promise<string> {
        const layoutSource = await fs.readFile(
            path.join(process.cwd(), "src", "templates", "base.hbs"),
            "utf-8",
        );
        const layoutTemplate = handlebars.compile(layoutSource);
        const templateSource = await fs.readFile(
            path.join(process.cwd(), "src", "templates", `${templateName}.hbs`),
            "utf-8",
        );
        const childTemplate = handlebars.compile(templateSource);
        const childHtml = childTemplate(context);
        return layoutTemplate({ ...context, body: childHtml });
    }
}

export const emailService = new EmailService();
