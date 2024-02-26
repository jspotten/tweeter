import {AuthToken, User} from "tweeter-shared";
import {Presenter, View} from "../Presenter";
import {AuthenticateService} from "../../model/AuthenticateService";

export interface AuthenticationView extends View {
    authenticate: (user: User, authToken: AuthToken) => void,
    navigateTo: (url: string) => void
}

export abstract class AuthenticationPresenter<T> extends Presenter<AuthenticationView> {
    protected service: AuthenticateService;
    
    protected constructor(view: AuthenticationView) {
        super(view)
        this.service = new AuthenticateService();
    }

    protected async authenticate(url: string, ...args: any[])
    {
        await this.reportFailingAction(async () => {
            let [user, authToken] = await this.validate(args)

            this.view.authenticate(user, authToken);
            this.view.navigateTo(url);
        }, this.getItemDetails());
    }

    protected abstract validate(...args: any[]): Promise<[User, AuthToken]>;

    protected abstract getItemDetails(): string;
}