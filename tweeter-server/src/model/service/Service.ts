import {DdbDaoFactory} from "../dao/factory/DdbDaoFactory";
import {DaoFactory} from "../dao/factory/DaoFactory";
import {AuthToken} from "tweeter-shared";

export abstract class Service {
    private expirationTime = 120000;
    protected daoFactory: DaoFactory = new DdbDaoFactory()
    protected authTokenDao = this.daoFactory.makeAuthTokenDao();

    protected async validateAuthToken(authToken: AuthToken)
    {
        if(Date.now() - authToken.timestamp > this.expirationTime)
        {
            await this.authTokenDao.deleteAuthToken(authToken.token)
            throw new Error("[Unauthorized Request] Authentication Token has expired!")
        }
    }
}