import { Status } from "tweeter-shared";

export class UpdateFeedLambdaRequest {
    public constructor(
        private _followerAliases: string[],
        private _newStatus: Status,
    ) {}

    public get followerAliases()
    {
        return this._followerAliases;
    }

    public get newStatus()
    {
        return this._newStatus;
    }

    static fromJson(request: UpdateFeedLambdaRequest): UpdateFeedLambdaRequest {
        const deserializedStatus = Status.fromJson(JSON.stringify(request._newStatus))
        if (deserializedStatus === null) {
            throw new Error(
                "UpdateFeedLambdaRequest, could not deserialize newStatus with json:\n" +
                JSON.stringify(request.newStatus)
            );
        }

        return new UpdateFeedLambdaRequest(
            request._followerAliases,
            deserializedStatus,
        )
    }
}