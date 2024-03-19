import {AuthToken} from "../../domain/AuthToken";
import {User} from "../../domain/User";
import {Status} from "../../domain/Status";

export interface Request {}

export interface AuthenticateRequest extends Request {
    alias: string,
    password: string
}

export interface CountRequest extends Request{
    authToken: AuthToken,
    user: User
}

export interface LoadItemsRequest<T extends Status | User> extends Request {
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: T | null
}