import {DdbAuthTokenDao} from "../authtoken/DdbAuthTokenDao";
import {DdbUsersDao} from "../users/DdbUsersDao";
import {DdbFollowsDao} from "../follows/DdbFollowsDao";
import {DdbFeedDao} from "../feed/DdbFeedDao";
import {DdbStoryDao} from "../story/DdbStoryDao";
import {FollowsDao} from "../follows/FollowsDao";
import {FeedDao} from "../feed/FeedDao";
import {AuthTokenDao} from "../authtoken/AuthTokenDao";
import {DaoFactory} from "./DaoFactory";
import {StoryDao} from "../story/StoryDao";
import {UsersDao} from "../users/UsersDao";

export class DdbDaoFactory implements DaoFactory {
    public makeFollowsDao(): FollowsDao
    {
        return new DdbFollowsDao();
    }

    public makeFeedDao(): FeedDao
    {
        return new DdbFeedDao();
    }

    public makeStoryDao(): StoryDao
    {
        return new DdbStoryDao();
    }

    public makeAuthTokenDao(): AuthTokenDao
    {
        return new DdbAuthTokenDao();
    }

    public makeUsersDao(): UsersDao
    {
        return new DdbUsersDao();
    }
}