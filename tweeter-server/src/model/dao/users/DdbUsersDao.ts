import {UsersDao} from "./UsersDao";
import {AuthToken, User} from "tweeter-shared";

export class DdbUsersDao implements UsersDao{
    readonly tableName: string = 'users';

    getUser(authToken: AuthToken, userHandle: string): Promise<User | undefined> {
        return Promise.resolve(undefined);
    }

    putUser(user: User): Promise<void> {
        return Promise.resolve(undefined);
    }

}