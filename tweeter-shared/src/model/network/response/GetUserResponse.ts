import {TweeterResponse} from "./Response";
import {UserDTO} from "../../dto/UserDTO";

export interface GetUserResponse extends TweeterResponse {
    readonly userDTO: UserDTO | null;
}