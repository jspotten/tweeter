import {FollowsDao} from "../follows/FollowsDao";
import {FeedDao} from "../feed/FeedDao";
import {AuthTokenDao} from "../authtoken/AuthTokenDao";
import {StoryDao} from "../story/StoryDao";
import {UsersDao} from "../users/UsersDao";
import {S3Dao} from "../s3/S3Dao";

export interface DaoFactory {
    makeFollowsDao(): FollowsDao;
    makeFeedDao(): FeedDao;
    makeStoryDao(): StoryDao;
    makeAuthTokenDao(): AuthTokenDao;
    makeUsersDao(): UsersDao;
    makeS3Dao(): S3Dao
}