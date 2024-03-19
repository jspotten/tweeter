import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import {UserService} from "../../model/service/UserService";
import {NavigationPresenter, NavigationView} from "../../presenter/main/NavigationPresenter";
import {useState} from "react";

interface NavigationHook {
    navigateToUser (event : React.MouseEvent) : Promise<void>,
}

export const useNavigationHook = () : NavigationHook => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } =
        useUserInfoHook();
    const service = new UserService()

    const listener: NavigationView = {
        authToken: authToken,
        currentUser: currentUser,
        setDisplayedUser: setDisplayedUser,
        displayErrorMessage: displayErrorMessage,
    }

    const [presenter] = useState(new NavigationPresenter(listener))

    const navigateToUser = async (event: React.MouseEvent) => {
        await presenter.navigateToUser(event);
    };

    return {
        navigateToUser : navigateToUser,
    };
}