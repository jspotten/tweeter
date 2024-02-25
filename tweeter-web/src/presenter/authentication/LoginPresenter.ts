import {AuthToken, User} from "tweeter-shared";
import {AuthenticateService} from "../../model/AuthenticateService";
import {Presenter, View} from "../Presenter";

export interface LoginView extends View{
    authenticate: (user: User, authToken: AuthToken) => void,
    navigateTo: (url: string) => void,
}

export class LoginPresenter extends Presenter<LoginView>
{
    private service: AuthenticateService;

    public constructor(view: LoginView)
    {
        super(view);
        this.service = new AuthenticateService()
    }

    public async login(alias: string, password: string, url: string)
    {
        await this.reportFailingAction(async () => {
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
        }, 'log user in')
    }
}