import {User} from "tweeter-shared";

export interface UsersDao {
    readonly tableName: string;
    putUser(user: User, password: string): Promise<User | undefined>;
    getUserByHandle(
        userHandle: string
    ): Promise<[User | null, string, number, number]>
    updateUserFollowerCount(userHandle: string, value: number): Promise<void>
    updateUserFolloweeCount(userHandle: string, value: number): Promise<void>
}
