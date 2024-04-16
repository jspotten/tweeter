import { UsersDao } from "./UsersDao";
import {DdbDao} from "../DdbDao";
import {
    GetCommand,
    PutCommand,
    UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {User} from "tweeter-shared";


export class DdbUsersDao extends DdbDao implements UsersDao {
    readonly tableName: string = 'users';
    readonly handle: string = "handle";
    readonly password: string = "password"
    readonly first: string = "first_name";
    readonly last: string = "last_name";
    readonly imgUrl: string = "img_url";
    readonly followersCount: string = 'followers_count';
    readonly followeesCount: string = 'followees_count';
    
    public async getUserByHandle(userHandle: string): Promise<[User | null, string, number, number]> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.handle]: userHandle
            }
        };
        const output = await this.getClient().send(new GetCommand(params));
        return output.Item == undefined
            ? [null, "", 0, 0]
            : [
                new User(
                    output.Item[this.first],
                    output.Item[this.last],
                    output.Item[this.handle],
                    output.Item[this.imgUrl]
                ),
                output.Item[this.password],
                output.Item[this.followersCount],
                output.Item[this.followeesCount]
            ];
    }

    public async putUser(user: User, password: string): Promise<User | undefined> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.handle]: user.alias,
                [this.password]: password,
                [this.first]: user.firstName,
                [this.last]: user.lastName,
                [this.imgUrl]: user.imageUrl,
                [this.followersCount]: 0,
                [this.followeesCount]: 0,
            }
        }
        await this.getClient().send(new PutCommand(params));
        return user;
    }

    public async updateUserFollowerCount(userHandle: string, value: number): Promise<void>
    {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.handle]: userHandle
            },
            ExpressionAttributeValues: { ":val": value},
            UpdateExpression:
                "SET " + this.followersCount + " = " + this.followersCount + " + :val",
        };
        await this.getClient().send(new UpdateCommand(params));
    }

    public async updateUserFolloweeCount(userHandle: string, value: number): Promise<void>
    {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.handle]: userHandle
            },
            ExpressionAttributeValues: { ":val": value},
            UpdateExpression:
                "SET " + this.followeesCount + " = " + this.followeesCount + " + :val",
        };
        await this.getClient().send(new UpdateCommand(params));
    }
}