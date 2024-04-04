import {AuthToken, Status, User} from "tweeter-shared"
import {DdbDaoFactory} from "../dao/factory/DdbDaoFactory";
import {DaoFactory} from "../dao/factory/DaoFactory";
import {Service} from "./Service";

export class StatusService extends Service {
    private daoFactory: DaoFactory = new DdbDaoFactory();
    private feedDao = this.daoFactory.makeFeedDao();
    private storyDao = this.daoFactory.makeStoryDao();
    private followsDao = this.daoFactory.makeFollowsDao();


    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean, string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [[], false, "Authentication Token has expired!", false]
        }

        const statusDataPage = await this.feedDao.getPageOfFeedStatuses(
            user.alias,
            pageSize,
            lastItem,
        );
        return [statusDataPage.values, statusDataPage.hasMorePages, "Successful Loading of More Feed Items", false]
    };

    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean, string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return [[], false, "Authentication Token has expired!", false]
        }

        const statusDataPage = await this.storyDao.getPageOfStoryStatuses(
            user.alias,
            pageSize,
            lastItem,
        );
        return [statusDataPage.values, statusDataPage.hasMorePages, "Successful Loading of More Feed Items", false]
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<[string, boolean]> {
        if(this.validateAuthToken(authToken.timestamp))
        {
            return ["Authentication Token has expired!", false]
        }

        await this.storyDao.putStatus(newStatus);
        const followers = await this.followsDao.getFollowers(newStatus.user.alias);

        for(let followeeHandle in followers)
        {
            await this.feedDao.putStatus(followeeHandle, newStatus);
        }
        return ["Successful Posting of Status", true]
    };
}