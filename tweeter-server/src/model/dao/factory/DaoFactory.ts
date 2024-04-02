import {FollowsDao} from "../follows/FollowsDao";
import {FeedDao} from "../feed/FeedDao";
import {AuthTokenDao} from "../authtoken/AuthTokenDao";
import {StoryDao} from "../story/StoryDao";
import {UsersDao} from "../users/UsersDao";

export interface DaoFactory {
    makeFollowsDao(): FollowsDao;
    makeFeedDao(): FeedDao;
    makeStoryDao(): StoryDao;
    makeAuthTokenDao(): AuthTokenDao;
    makeUsersDao(): UsersDao;
}