import {UsersDao} from "./UsersDao";
import {AuthToken, User} from "tweeter-shared";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
} from "@aws-sdk/lib-dynamodb";


export class DdbUsersDao implements UsersDao {
    readonly tableName: string = 'users';
    readonly handle: string = "handle";
    readonly password: string = "password"
    readonly first: string = "first_name";
    readonly last: string = "last_name";
    readonly imgUrl: string = "img_url";

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

    public async getUser(authToken: AuthToken, userHandle: string): Promise<User | undefined> {
        return Promise.resolve(undefined);
    }

    public async getUserByHandle(userHandle: string): Promise<[User | undefined, string]> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.handle]: userHandle
            }
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined
            ? [undefined, ""]
            : [new User(
                output.Item[this.first],
                output.Item[this.last],
                output.Item[this.handle],
                output.Item[this.imgUrl],
            ), output.Item[this.password]];
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
            }
        }
        await this.client.send(new PutCommand(params));
        return user;
    }
}