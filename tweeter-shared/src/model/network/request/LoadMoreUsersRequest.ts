import { User } from "../../domain/User";
import {LoadMoreItemsRequest, LoadMoreItemsRequestJson} from "./LoadMoreItemsRequest";
import { AuthToken } from "../../domain/AuthToken";

export class LoadMoreUsersRequest extends LoadMoreItemsRequest<User, LoadMoreUsersRequest> {
    public constructor(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null)
    {
        super(authToken, user, pageSize, lastItem);
    }

    public fromJson(request: LoadMoreUsersRequest): LoadMoreUsersRequest
    {
        const jsonObject: LoadMoreItemsRequestJson =
            request as unknown as LoadMoreItemsRequestJson;

        const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject._authToken))
        if (deserializedToken === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize authToken with json:\n" +
                JSON.stringify(jsonObject._authToken)
            );
        }


        const deserializedUser = User.fromJson(JSON.stringify(jsonObject._user))
        if (deserializedUser === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize user with json:\n" +
                JSON.stringify(jsonObject._user)
            );
        }

        const deserializedLastItem = User.fromJson(JSON.stringify(jsonObject._lastItem))
        if (deserializedLastItem === null) {
            throw new Error(
                "AuthenticateResponse, could not deserialize lastItem with json:\n" +
                JSON.stringify(jsonObject._lastItem)
            );
        }

        return new LoadMoreUsersRequest(
            deserializedToken,
            deserializedUser,
            request.pageSize,
            deserializedLastItem,
        );
    }
}