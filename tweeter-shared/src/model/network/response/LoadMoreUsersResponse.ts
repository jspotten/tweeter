import {LoadMoreItemsResponse, ResponseJson} from "./LoadMoreItemsResponse";
import {User} from "../../domain/User";

export class LoadMoreUsersResponse extends LoadMoreItemsResponse<User> {
    public constructor(
        items: User[],
        hasMoreItems: boolean,
        message: string,
        success: boolean)
    {
        super(items, hasMoreItems, message, success);
    }

    static fromJson(json: LoadMoreItemsResponse<User>): LoadMoreUsersResponse
    {
        interface LoadMoreItemsResponseJson extends ResponseJson {
            _items: JSON[];
            _hasMoreItems: JSON;
        }

        const jsonObject: LoadMoreItemsResponseJson =
            json as unknown as LoadMoreItemsResponseJson;
        const deserializedItems: User[] = []
        for(let item in jsonObject._items)
        {
            let itemJson = jsonObject._items[item];
            let deserializedStatus = User.fromJson(JSON.stringify(itemJson));
            if(deserializedStatus)
                deserializedItems.push(deserializedStatus)
        }

        const deserializedHasMoreItems: boolean = JSON.parse(JSON.stringify(jsonObject._hasMoreItems));
        if (deserializedHasMoreItems === null) {
            throw new Error("LoadMoreUsersResponse, could not deserialize token with json");
        }

        return new LoadMoreUsersResponse(
            deserializedItems,
            deserializedHasMoreItems,
            jsonObject._message,
            jsonObject._success,
        );
    }
}