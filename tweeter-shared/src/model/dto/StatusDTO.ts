import {User} from "../domain/User";
import {PostSegment} from "../domain/PostSegment";

export interface StatusDTO {
    readonly post: string,
    readonly user: User,
    readonly timestamp: number,
    readonly segments: PostSegment[],
}