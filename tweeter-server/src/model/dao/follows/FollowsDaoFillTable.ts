import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput } from "@aws-sdk/lib-dynamodb";
import { execSync } from "child_process";
import {DdbDao} from "../DdbDao";
import {User} from "tweeter-shared";

export class FollowsDaoFillTable extends DdbDao {

    private TABLE_NAME = "follows";
    private PRIMARY_KEY = "follower_handle";
    private SORT_KEY = "followee_handle";

    async createFollows(followee: User, followerList: User[]){
        if(followerList.length == 0){
            console.log('zero followers to batch write');
            return;
        }
        else{
            const params = {
                RequestItems: {
                    [this.TABLE_NAME]: this.createPutFollowRequestItems(followee, followerList)
                }
            }
            await this.getClient().send(new BatchWriteCommand(params))
                .then(async (resp: any)=>{
                    await this.putUnprocessedItems(resp, params, 0);
                    return;
                })
                .catch((err: any) => {
                    throw new Error('Error while batchwriting follows with params: ' + params + ": \n" + err);
                });
        }
    }
    private createPutFollowRequestItems(followee: User, followerList: User[]){
        return followerList.map(followerAlias =>
            this.createPutFollowRequest(followerAlias, followee));
    }

    private createPutFollowRequest(follower: User, followee: User){
        let item = {
            [this.PRIMARY_KEY]: follower.alias,
            [this.SORT_KEY]: followee.alias,
            ["follower_user"]: JSON.stringify(follower),
            ["followee_user"]: JSON.stringify(followee),
        }
        return {
            PutRequest: {
                Item: item
            }
        }
    }
    private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput, attempts: number){
        if(attempts > 1) console.log(attempts + 'th attempt starting');
        ;   if(resp.UnprocessedItems != undefined){
            let sec = 0.03;
            if (Object.keys(resp.UnprocessedItems).length > 0) {
                console.log(Object.keys(resp.UnprocessedItems[this.TABLE_NAME]).length + ' unprocessed items');
                //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling.
                // @ts-ignore
                params.RequestItems = resp.UnprocessedItems;
                execSync('sleep ' + sec);
                if(sec < 10) sec += 0.1;
                await this.getClient().send(new BatchWriteCommand(params))
                    .then(async (innerResp: any) => {
                        if(innerResp.UnprocessedItems != undefined && Object.keys(innerResp.UnprocessedItems).length > 0){
                            params.RequestItems = innerResp.UnprocessedItems;
                            ++attempts
                            await this.putUnprocessedItems(innerResp, params, attempts)
                        }
                    }).catch((err: any) => {
                        console.log('error while batch writing unprocessed items ' + err);
                    });

            }
        }
    }
}