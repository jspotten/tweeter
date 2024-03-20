import {
    GetUserRequest,
    GetUserResponse,
    User
} from "tweeter-shared";
import {UserService} from "../model/service/UserService";

export const handler = async (event: GetUserRequest): Promise<GetUserResponse> => {
    const user = await new UserService().getUser(event.authToken, event.alias);
    return {
        userDTO: user ? new User(
            user.firstName,
            user.lastName,
            user.alias,
            user.imageUrl).dto
            : null,
    } as GetUserResponse
};