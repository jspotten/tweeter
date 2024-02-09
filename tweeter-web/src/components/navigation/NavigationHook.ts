import {AuthToken, FakeData, User} from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import {useUserInfoHook} from "../userInfo/UserInfoHook";
import {UserService} from "../../model/UserService";

interface NavigationHook {
    navigateToUser (event : React.MouseEvent) : Promise<void>,
    extractAlias (value : string) : string,
    getUser (authToken : AuthToken, alias : string) : Promise<User | null>
}

export const useNavigationHook = () : NavigationHook => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
        useUserInfoHook();
    const service = new UserService()

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try
        {
            let alias = extractAlias(event.target.toString());

            let user = await service.getUser(authToken!, alias);

            if(!!user)
            {
                if(currentUser!.equals(user))
                {
                    setDisplayedUser(currentUser!);
                }
                else
                {
                    setDisplayedUser(user);
                }
            }
        }
        catch (error)
        {
            displayErrorMessage(`Failed to get user because of exception: ${error}`);
        }
    };

    const extractAlias = (value: string): string => {
        let index = value.indexOf("@");
        return value.substring(index);
    };

    return {
        navigateToUser : navigateToUser,
        extractAlias : extractAlias,
        getUser : service.getUser
    };
}