import { removeOldTokensCron } from "./remover-old-tokens";

export const cronRunner = async () => {
    removeOldTokensCron.start();
};
