import { ITokens, TokenModel } from "../interfaces/tokens.interface";
import { Token } from "../models/token.model";

class TokenRepository {
    public create(tokenModel: TokenModel): Promise<ITokens> {
        return Token.create(tokenModel);
    }
}

export const tokenRepository = new TokenRepository();
