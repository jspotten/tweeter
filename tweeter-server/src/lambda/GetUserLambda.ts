import {
    GetUserRequest,
    GetUserResponse,
    User
} from "tweeter-shared";
import {UserService} from "../model/service/UserService";

export const handler = async (event: GetUserRequest): Promise<GetUserResponse> => {
    try {
        if(!event.authToken || !event.alias)
        {
            throw new Error("[Bad Request]");
        }

        const user = await new UserService().getUser(event.authToken, event.alias);
        return {
            userDTO: user ? new User(
                    user.firstName,
                    user.lastName,
                    user.alias,
                    user.imageUrl).dto
                : null,
        } as GetUserResponse
    }
    catch (error)
    {
        throw new Error(`[Internal Server Error]: ${error}`);
    }
};