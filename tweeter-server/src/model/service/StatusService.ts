import {AuthToken, FakeData, Status, User} from "tweeter-shared"
import {DdbDaoFactory} from "../dao/factory/DdbDaoFactory";
import {DaoFactory} from "../dao/factory/DaoFactory";

export class StatusService {
    private daoFactory: DaoFactory = new DdbDaoFactory();
    private feedDao = this.daoFactory.makeFeedDao();
    private storyDao = this.daoFactory.makeStoryDao();


    public async loadMoreFeedItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean, string, boolean]> {
        // const pageOfStatuses = this.followsDao.get
        return [...FakeData.instance.getPageOfStatuses(lastItem, pageSize), "Successful Loading of More Feed Items", true];
    };

    public async loadMoreStoryItems(
        authToken: AuthToken,
        user: User,
        pageSize: number,
        lastItem: Status | null
    ): Promise<[Status[], boolean, string, boolean]> {
        // TODO: Replace with the result of calling server
        return [...FakeData.instance.getPageOfStatuses(lastItem, pageSize), "Successful Loading of More Story Items", true];
    };

    public async postStatus(
        authToken: AuthToken,
        newStatus: Status
    ): Promise<[string, boolean]> {
        // Pause so we can see the logging out message. Remove when connected to the server
        await new Promise((f) => setTimeout(f, 2000));

        // TODO: Call the server to post the status
        return ["Successful Posting of Status", true]
    };
}