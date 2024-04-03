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
import {S3Dao} from "../s3/S3Dao";
import {DdbS3Dao} from "../s3/DdbS3Dao";

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

    public makeS3Dao(): S3Dao
    {
        return new DdbS3Dao();
    }
}