import {Service} from "./Service";
import {AuthToken, Status, User} from "tweeter-shared";

export class StatusService extends Service {
    private feedDao = this.daoFactory.makeFeedDao();
    private storyDao = this.daoFactory.makeStoryDao();
    private followsDao = this.daoFactory.makeFollowsDao();

    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean, string, boolean]> {
        await this.validateAuthToken(authToken)

        const statusDataPage = await this.feedDao.getPageOfFeedStatuses(
            user.alias,
            pageSize,
            lastItem,
        );
        return [statusDataPage.values, statusDataPage.hasMorePages, "Successful Loading of More Feed Items", false];
    };

    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean, string, boolean]> {
        await this.validateAuthToken(authToken)

        const statusDataPage = await this.storyDao.getPageOfStoryStatuses(
            user.alias,
            pageSize,
            lastItem,
        );
        return [statusDataPage.values, statusDataPage.hasMorePages, "Successful Loading of More Feed Items", false];
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<[string, boolean]> {
        await this.validateAuthToken(authToken)

        await this.storyDao.putStatus(newStatus);
        const followers = await this.followsDao.getFollowers(newStatus.user.alias);

        for(let followeeHandle in followers)
        {
            await this.feedDao.putStatus(followeeHandle, newStatus);
        }
        return ["Successful Posting of Status", true]
    };
}