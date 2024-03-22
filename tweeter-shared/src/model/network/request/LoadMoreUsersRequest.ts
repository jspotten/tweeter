import { User } from "../../domain/User";
import {LoadMoreItemsRequest, LoadMoreItemsRequestJson} from "./LoadMoreItemsRequest";
import { AuthToken } from "../../domain/AuthToken";

export class LoadMoreUsersRequest extends LoadMoreItemsRequest<User> {
    public constructor(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: User | null)
    {
        super(authToken, user, pageSize, lastItem);
    }

    static fromJson(request: LoadMoreUsersRequest): LoadMoreUsersRequest
    {
        const jsonObject: LoadMoreItemsRequestJson =
            request as unknown as LoadMoreItemsRequestJson;

        const deserializedToken = AuthToken.fromJson(JSON.stringify(jsonObject.authToken))
        if (deserializedToken === null) {
            throw new Error(
                "LoadMoreUsersRequest, could not deserialize authToken with json:\n" +
                JSON.stringify(jsonObject.authToken)
            );
        }

        const deserializedUser = User.fromJson(JSON.stringify(jsonObject.user))
        if (deserializedUser === null) {
            throw new Error(
                "LoadMoreUsersRequest, could not deserialize user with json:\n" +
                JSON.stringify(jsonObject.user)
            );
        }

        const deserializedLastItem = User.fromJson(JSON.stringify(jsonObject.lastItem))
        if (deserializedLastItem === null) {
            throw new Error(
                "LoadMoreUsersRequest, could not deserialize lastItem with json:\n" +
                JSON.stringify(jsonObject.lastItem)
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