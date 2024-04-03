import {AuthTokenDao} from "./AuthTokenDao";
import {AuthToken} from "tweeter-shared";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";


export class DdbAuthTokenDao implements AuthTokenDao {
    readonly tableName: string = 'authtokens';
    readonly authToken = 'token'
    readonly timestamp = 'timestamp'

    private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());


    public async getAuthToken(authToken: string): Promise<AuthToken | undefined> {
        return Promise.resolve(undefined);
    }

    public async putAuthToken(authToken: string): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.authToken]: authToken,
                [this.timestamp]: Date.now(),
            }
        }
        await this.client.send(new PutCommand(params))
    }

    public async deleteAuthToken(authToken: string): Promise<void>
    {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.authToken]: authToken
            }
        };
        await this.client.send(new DeleteCommand(params));
    }
}