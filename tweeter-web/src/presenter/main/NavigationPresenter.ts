import {UserService} from "../../model/service/UserService";
import {AuthToken, User} from "tweeter-shared";
import React from "react";
import {Presenter, View} from "../Presenter";

export interface NavigationView extends View {
    authToken: AuthToken | null,
    currentUser: User | null,
    setDisplayedUser: (user: User) => void,
}

export class NavigationPresenter extends Presenter<NavigationView>{
    private service: UserService;

    public constructor(view: NavigationView) {
        super(view);
        this.service = new UserService();
    }

    public async navigateToUser(event: React.MouseEvent)
    {
        event.preventDefault();
        await this.reportFailingAction(async () => {
            let alias = this.extractAlias(event.target.toString());
            let user = await this.service.getUser(this.view.authToken!, alias);

            if(!!user)
            {
                if(this.view.currentUser!.equals(user))
                {
                    this.view.setDisplayedUser(this.view.currentUser!);
                }
                else
                {
                    this.view.setDisplayedUser(user);
                }
            }
        }, this.getItemDetails())
    }

    public extractAlias(value: string): string
    {
        let index = value.indexOf("@");
        return value.substring(index);
    };

    protected getItemDetails(): string {
        return 'get user';
    }
}
