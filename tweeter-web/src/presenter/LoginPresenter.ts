import {AuthToken, User} from "tweeter-shared";
import {AuthenticateService} from "../model/AuthenticateService";

export interface LoginView {
    authenticate: (user: User, authToken: AuthToken) => void,
    navigateTo: (url: string) => void,
    updateUserInfo: (user1: User, user2: User, authToken: AuthToken, rememberMe: boolean) => void,
    displayErrorMessage: (msg: string) => void,
}

export class LoginPresenter
{
    private view: LoginView;
    private service: AuthenticateService;

    public constructor(view: LoginView)
    {
        this.view = view
        this.service = new AuthenticateService()
    }

    public async login(alias: string, password: string, url: string)
    {
        try
        {
            let [user, authToken] = await this.service.login(alias, password);
            this.view.authenticate(user, authToken);

            if (!!url)
            {
                this.view.navigateTo(url);
            }
            else
            {
                this.view.navigateTo("/");
            }
        }
        catch (error)
        {
            this.view.displayErrorMessage(
                `Failed to log user in because of exception: ${error}`
            );
        }
    }
}