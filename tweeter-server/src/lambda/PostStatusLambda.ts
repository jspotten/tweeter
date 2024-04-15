import {
    PostStatusRequest,
    TweeterResponse,
    Status
} from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export const handler = async (event: PostStatusRequest): Promise<TweeterResponse> => {
    try {
        const postStatusRequest = PostStatusRequest.fromJson(event);
        if(!postStatusRequest.authToken || !postStatusRequest.newStatus)
        {
            throw new Error("[Bad Request]");
        }

        const [ message, success] =
            await new StatusService().postStatus(postStatusRequest.authToken, postStatusRequest.newStatus);

        await sendMessage(postStatusRequest.newStatus)

        return { _message: message, _success: success }
    }
    catch (error)
    {
        if(error instanceof Error)
            throw new Error(`${error.message}`);
        throw new Error(`[Internal Server Error]: ${error}`)
    }
};

async function sendMessage(status: Status): Promise<void> {
    let sqsClient = new SQSClient();
    const sqs_url = "https://sqs.us-west-2.amazonaws.com/972160817952/tweeter-post-status";

    const params = {
        DelaySeconds: 10,
        MessageBody: JSON.stringify(status.dto),
        QueueUrl: sqs_url,
    };

    try {
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.log("Success, message sent. MessageID:", data.MessageId);
    } catch (err) {
        throw err;
    }
}
