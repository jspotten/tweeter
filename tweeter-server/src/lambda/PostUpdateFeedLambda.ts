import {Status, User} from "tweeter-shared"
import {UserService} from "../model/service/UserService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import {UpdateFeedLambdaRequest} from "../model/UpdateFeedLambdaRequest";

export const handler = async (event: any) => {
    for(let i = 0; i < event.Records.length; i++)
    {
        const { body } = event.Records[i];
        const status: Status | null = Status.fromJson(body);
        if(status)
        {
            let hasMoreItems = true;
            let lastItem: User | null = null
            while(hasMoreItems)
            {
                let [ aliases, _hasMoreItems, _lastItem] = await new UserService().getFollowers(
                    status.user.alias,
                    200,
                    lastItem,
                )
                hasMoreItems = _hasMoreItems
                lastItem = _lastItem
                await sendMessage(aliases, status)
            }
        }
    }
}

async function sendMessage(aliases: string[], status: Status): Promise<void> {
    let sqsClient = new SQSClient();
    const sqs_url = "https://sqs.us-west-2.amazonaws.com/972160817952/tweeter-update-feed";

    const params = {
        DelaySeconds: 10,
        MessageBody: JSON.stringify(new UpdateFeedLambdaRequest(aliases, status)),
        QueueUrl: sqs_url,
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
        throw err;
    }
}