import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {LoadItemsRequest} from "./Request";
import {Status} from "../../domain/Status";

export class LoadMoreItemsRequest<T extends Status | User> implements LoadItemsRequest<T>{
    public constructor(
        public authToken: AuthToken,
        public user: User,
        public pageSize: number,
        public lastItem: T | null
    ){}
}