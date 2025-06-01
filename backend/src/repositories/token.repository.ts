import { ITokens, TokenModel } from "../interfaces/tokens.interface";
import { Token } from "../models/token.model";

class TokenRepository {
    public create(tokenModel: TokenModel): Promise<ITokens> {
        return Token.create(tokenModel);
    }

    public findByParams(params: Partial<ITokens>) {
        return Token.find(params);
    }
}

export const tokenRepository = new TokenRepository();
