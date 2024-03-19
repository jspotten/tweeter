import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Status} from "../../domain/Status";

export interface Request {

}

export interface AuthenticateRequest {
    alias: string,
    password: string
}

export interface CountRequest {
    authToken: AuthToken,
    user: User
}

export interface LoadItemsRequest<T extends Status | User> {
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: T | null
}