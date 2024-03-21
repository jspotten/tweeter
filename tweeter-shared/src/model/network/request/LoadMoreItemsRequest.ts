import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {LoadItemsRequest} from "./Request";
import {Status} from "../../domain/Status";


export interface LoadMoreItemsRequestJson {
    _authToken: JSON,
    _user: JSON,
    _pageSize: JSON,
    _lastItem: JSON
}

export abstract class LoadMoreItemsRequest<U extends Status | User, T> implements LoadItemsRequest<U>{
    protected constructor(
        public authToken: AuthToken,
        public user: User,
        public pageSize: number,
        public lastItem: U | null
    ){}

    protected abstract fromJson(request: LoadMoreItemsRequest<U, T>): T;
}