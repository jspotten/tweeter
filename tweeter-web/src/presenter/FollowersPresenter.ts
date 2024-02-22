import {AuthToken, User} from "tweeter-shared";
import {UserItemPresenter, UserItemView} from "./UserItemPresenter";
import {UserService} from "../model/UserService";

export const PAGE_SIZE = 10;

export class FollowersPresenter extends UserItemPresenter {
    private service: UserService;
    private lastItem: User | null = null;

    public constructor(view: UserItemView)
    {
        super(view);
        this.service = new UserService()
    }

    public async loadMoreItems(authToken: AuthToken, user: User)
    {
        try
        {
            if (this.hasMoreItems)
            {
                let [newItems, hasMore] = await this.service.loadMoreFollowers(authToken, user, PAGE_SIZE, this.lastItem);

                this.hasMoreItems = hasMore;
                this.lastItem = newItems[newItems.length - 1];
                this.view.addItems(newItems);
            }
        }
        catch (error)
        {
            this.view.displayErrorMessage(
                `Failed to load follower because of exception: ${error}`
            );
        }
    }
}