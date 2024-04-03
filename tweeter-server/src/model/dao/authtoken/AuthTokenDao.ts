import {AuthToken} from "tweeter-shared";

export interface AuthTokenDao {
    readonly tableName: string;
    putAuthToken(authToken: string): Promise<void>;
    getAuthToken(authToken: string): Promise<AuthToken | undefined>;
    deleteAuthToken(authToken: string, timestamp: number): Promise<void>;
}