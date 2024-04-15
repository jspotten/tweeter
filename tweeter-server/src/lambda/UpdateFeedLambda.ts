import {UpdateFeedLambdaRequest} from "../model/UpdateFeedLambdaRequest";
import {StatusService} from "../model/service/StatusService";

export const handler = async (event: any) => {
    for (let i = 0; event.Records.length; i++)
    {
        const { body } = event.Records[i];
        const updateFeedLambdaRequest: UpdateFeedLambdaRequest =
            UpdateFeedLambdaRequest.fromJson(JSON.parse(body));

        await new StatusService().postStatusToFeed(
            updateFeedLambdaRequest.followerAliases,
            updateFeedLambdaRequest.newStatus
        );
    }
}