import {AuthToken} from "tweeter-shared";

export interface AuthTokenDao {
    readonly tableName: string;
    putAuthToken(token: AuthToken): Promise<void>;
    getAuthToken(token: AuthToken): Promise<AuthToken | undefined>;
}