import {AuthToken, User} from "tweeter-shared";

export interface UsersDao {
    readonly tableName: string;
    putUser(user: User): Promise<void>;
    getUser(
        authToken: AuthToken,
        userHandle: string,
    ): Promise<User | undefined>;
}
