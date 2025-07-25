import { EmailEnums } from "../enums/email.enums";

export type IEmailData = {
    subject: string;
    template: string;
};

export type IEmailConstants<T extends Record<string, string>> = {
    [K in keyof T]: IEmailData;
};

export const emailConstants: IEmailConstants<typeof EmailEnums> = {
    [EmailEnums.WELCOME]: {
        subject: "Welcome",
        template: "welcome",
    },
    [EmailEnums.ACTIVATE]: {
        subject: "Activate",
        template: "activate",
    },
    [EmailEnums.RECOVERY]: {
        subject: "Recovery",
        template: "recovery",
    },
    [EmailEnums.RECOVERY_SUCCESS]: {
        subject: "Recovery",
        template: "recovery-success",
    },
};
