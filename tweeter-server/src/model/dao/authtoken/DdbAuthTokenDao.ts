import {AuthTokenDao} from "./AuthTokenDao";
import {AuthToken} from "tweeter-shared";

export class DdbAuthTokenDao implements AuthTokenDao {
    readonly tableName: string = 'authtokens';

    getAuthToken(token: AuthToken): Promise<AuthToken | undefined> {
        return Promise.resolve(undefined);
    }

    putAuthToken(token: AuthToken): Promise<void> {
        return Promise.resolve(undefined);
    }

}