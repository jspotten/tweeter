import {StatusItemPresenter} from "./StatusItemPresenter";
import {AuthToken, Status, User} from "tweeter-shared";
import {PAGE_SIZE, PagedItemView} from "../PagedItemPresenter";

export class FeedPresenter extends StatusItemPresenter {
    public constructor(view: PagedItemView<Status>) {
        super(view);
    }

    // protected async loadMoreItems(authToken: AuthToken, user: User)
    // {
    //     await this.reportFailingAction(async () => {
    //         if (this.hasMoreItems)
    //         {
    //             let [newItems, hasMore] = await this.service.loadMoreFeedItems(authToken, user, PAGE_SIZE, this.lastItem);
    //
    //             this.hasMoreItems = hasMore;
    //             this.lastItem = newItems[newItems.length - 1];
    //             this.view.addItems(newItems);
    //         }
    //     }, 'load feed')
    // };

    protected getMoreItems(authToken: AuthToken, user: User): Promise<[Status[], boolean]> {
        return this.service.loadMoreFeedItems(authToken, user, PAGE_SIZE, this.lastItem)
    }

    protected getItemDetails(): string {
        return 'load feed';
    }
}