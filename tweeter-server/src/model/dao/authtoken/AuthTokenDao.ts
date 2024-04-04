import {User} from "tweeter-shared";

export interface AuthTokenDao {
    readonly tableName: string;
    putAuthToken(token: string, user: User): Promise<void>;
    getTokenUser(token: string): Promise<User | null>;
    deleteAuthToken(token: string): Promise<void>;
}