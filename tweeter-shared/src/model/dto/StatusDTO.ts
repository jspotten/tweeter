import {User} from "../domain/User";
import {PostSegment} from "../domain/PostSegment";

export interface StatusDTO {
    readonly _post: string,
    readonly _user: User,
    readonly _timestamp: number,
    readonly _segments: PostSegment[],
}