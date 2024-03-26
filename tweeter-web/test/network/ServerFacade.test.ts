import { ServerFacade } from "../../src/model/network/ServerFacade";
import "@testing-library/jest-dom"
import {
    AuthToken,
    FollowCountRequest, LoadMoreStatusesRequest,
    LoadMoreUsersRequest,
    RegisterRequest, Status,
    User
} from "tweeter-shared";
import "isomorphic-fetch";
import {StatusService} from "../../src/model/service/StatusService";

describe('Client-Side ServerFacade Communications with Server',  () => {
    const serverFacade = new ServerFacade()
    const testUser = new User(
        "Bobby",
        "Dobby",
        "bDobby",
        "/image.png",
    )
    const testAuthToken =
        new AuthToken("11e2371e-ea29-44d8-8ca7-b264eb643801", 989824823)

    it('returns correct results when calling server\'s register endpoint', async () => {
        const registerRequest = new RegisterRequest(
            "Bobby",
            "Dobby",
            "bDobby",
            "password",
            "879hjhda23872"
        )

        const response = await serverFacade.register(registerRequest);
        expect(response).toEqual(expect.objectContaining( {
            _user: expect.any(User),
            _token: expect.any(AuthToken),
            _success: true,
            _message: 'Successful Registration'
        }))
    });

    it('returns correct results when calling server\'s getFollowers endpoint', async () => {
        const getFollowersRequest = new LoadMoreUsersRequest(
            testAuthToken,
            testUser,
            5,
            null
        );

        const response = await serverFacade.loadMoreFollowers(getFollowersRequest);
        expect(response).toEqual(expect.objectContaining( {
            _items: [
                expect.any(User),
                expect.any(User),
                expect.any(User),
                expect.any(User),
                expect.any(User)
            ],
            _hasMoreItems: true,
            _message: 'Successful Loading of More Followers',
            _success: true,
        }))
    });

    it('returns correct results when calling server\'s getFollowersCount endpoint', async () => {
        const followersCntRequest =
            new FollowCountRequest(testAuthToken, testUser)

        const response = await serverFacade.getFollowersCount(followersCntRequest)
        expect(response).toEqual(expect.objectContaining( {
            _count: expect.any(Number) ,
            _message: 'Successful Followers Count Retrieval',
            _success: true,
        }))
    });

    it('returns correct results when calling server\'s story endpoint', async () => {
        const statusService = new StatusService();

        const response = await statusService.loadMoreStoryItems(
            testAuthToken,
            testUser,
            5,
            null
        )
        expect(response).toEqual(expect.objectContaining( [
            [
                expect.any(Status),
                expect.any(Status),
                expect.any(Status),
                expect.any(Status),
                expect.any(Status),
            ],
            expect.any(Boolean)
        ]))
    });
})