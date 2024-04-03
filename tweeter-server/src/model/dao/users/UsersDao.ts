import {AuthToken, User} from "tweeter-shared";

export interface UsersDao {
    readonly tableName: string;
    putUser(user: User, password: string): Promise<User | undefined>;
    getUser(
        authToken: AuthToken,
        userHandle: string,
    ): Promise<User | undefined>;
    getUserByHandle(userHandle: string): Promise<[User | undefined, string]>
}
