import { compare, hash } from "bcrypt";

class PasswordService {
    public hashPass(password: string): Promise<string> {
        return hash(password, 10);
    }

    public comparePass(password: string, hashedPass: string): Promise<boolean> {
        return compare(password, hashedPass);
    }
}

export const passwordService = new PasswordService();
