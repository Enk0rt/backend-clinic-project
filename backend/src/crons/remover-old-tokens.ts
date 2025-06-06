import { CronJob } from "cron";

import { config } from "../configs/config";
import { timeHelper } from "../helpers/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
    try {
        const lifetime = config.JWT_REFRESH_LIFETIME;
        const { value, unit } = timeHelper.parseLifetime(lifetime);
        const date = timeHelper.subFromCurrentTime(value, unit);
        const count = await tokenRepository.deleteBeforeDate(date);

        if (count) {
            console.log(`Deleted ${count} old tokens`);
        }
    } catch (e) {
        console.error(e.message);
    }
};

export const removeOldTokensCron = new CronJob("0 * * * * *", handler);
