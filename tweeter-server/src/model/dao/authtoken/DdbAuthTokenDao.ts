import {AuthTokenDao} from "./AuthTokenDao";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import {User} from "tweeter-shared";


export class DdbAuthTokenDao implements AuthTokenDao {
    readonly tableName: string = 'authtokens';
    readonly token: string = 'token'
    readonly timestamp: string = 'timestamp'
    readonly user: string = 'user'

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


    public async getTokenUser(token: string): Promise<User | null> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token]: token
            }
        };
        const output = await this.client.send(new GetCommand(params));
        return output.Item == undefined ? null
        : User.fromJson(output.Item[this.user])
    }

    public async putAuthToken(token: string, user: User): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.token]: token,
                [this.timestamp]: Date.now(),
                [this.user]: JSON.stringify(user),
            }
        }
        await this.client.send(new PutCommand(params))
    }

    public async deleteAuthToken(token: string): Promise<void>
    {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.token]: token
            }
        };
        await this.client.send(new DeleteCommand(params));
    }
}