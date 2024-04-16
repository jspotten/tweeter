import {FeedDao} from "./FeedDao";
import {DataPage} from "../DataPage";
import {
    BatchWriteCommand,
    BatchWriteCommandInput,
    BatchWriteCommandOutput,
    DeleteCommand,
    PutCommand,
    QueryCommand
} from "@aws-sdk/lib-dynamodb";
import {Status} from "tweeter-shared";
import {DdbDao} from "../DdbDao";
import {execSync} from "child_process";

export class DdbFeedDao extends DdbDao implements FeedDao {
    readonly tableName: string = 'feed';
    readonly owner_handle = 'owner_handle';
    readonly timestamp = 'timestamp';
    readonly status = 'status';

    public async deleteStatus(status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Key: {
                [this.owner_handle]: status.user.alias,
                [this.timestamp]: status.timestamp,
            }
        };
        await this.getClient().send(new DeleteCommand(params));
    }

    public async getPageOfFeedStatuses(followerHandle: string, pageSize: number, lastStatus: Status | null): Promise<DataPage<Status>> {
        const params = {
            KeyConditionExpression: `${this.owner_handle} = :v`,
            ExpressionAttributeValues: {
                ":v": followerHandle,
            },
            TableName: this.tableName,
            ScanIndexForward: false,
            Limit: pageSize,
            ExclusiveStartKey:
                lastStatus === null
                    ? undefined
                    : {
                        [this.owner_handle]: followerHandle,
                        [this.timestamp]: lastStatus.timestamp,
                    },
        };

        const items: Status[] = [];
        const data = await this.getClient().send(new QueryCommand(params));
        const hasMorePages = data.LastEvaluatedKey !== undefined;
        // Store the entire user in the table instead of just the handle.
        data.Items?.forEach((item) => {
            let status = Status.fromJson(item.status);
            if(status)
            {
                items.push(status)
            }
        }
        );
        return new DataPage<Status>(items, hasMorePages);
    }

    public async putStatus(owner_handle: string, status: Status): Promise<void> {
        const params = {
            TableName: this.tableName,
            Item: {
                [this.owner_handle]: owner_handle,
                [this.timestamp]: status.timestamp,
                [this.status]: JSON.stringify(status),
            }
        }
        await this.getClient().send(new PutCommand(params));
    }

    public async putStatuses(followerAliases: string[], newStatus: Status){
        if(followerAliases.length == 0){
            console.log('zero follower aliases to batch write to');
            return;
        }
        else{
            const params = {
                RequestItems: {
                    [this.tableName]: this.createPutFeedStatusRequestItems(followerAliases, newStatus)
                }
            }
            await this.getClient().send(new BatchWriteCommand(params))
                .then(async (resp: any) => {
                    await this.putUnprocessedItems(resp, params);
                })
                .catch((err: any) => {
                    throw new Error('Error while batchwriting feed items with params: '+ params + ": \n" + err);
                });
        }
    }
    private createPutFeedStatusRequestItems(aliases: string[], status: Status){
        return aliases.map(alias => this.createPutFeedStatusRequest(alias, status));
    }
    private createPutFeedStatusRequest(alias: string, status: Status){
        let item = {
            [this.owner_handle]: alias,
            [this.timestamp]: status.timestamp,
            [this.status]: JSON.stringify(status),
        }
        return {
            PutRequest: {
                Item: item
            }
        };
    }

    private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput){
        if(resp.UnprocessedItems != undefined){
            let sec = 0.01;
            while(Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
                //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                // @ts-ignore
                params.RequestItems = resp.UnprocessedItems;
                execSync('sleep ' + sec);
                if(sec < 1) sec += 0.1;
                await this.getClient().send(new BatchWriteCommand(params));
                if(resp.UnprocessedItems == undefined){
                    break;
                }
            }
        }
    }
}