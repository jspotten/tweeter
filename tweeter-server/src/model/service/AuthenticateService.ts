import {AuthToken, User} from "tweeter-shared";
import {DdbDaoFactory} from "../dao/factory/DdbDaoFactory";
import {DaoFactory} from "../dao/factory/DaoFactory";
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';


export class AuthenticateService {
    private daoFactory: DaoFactory = new DdbDaoFactory();
    private usersDao = this.daoFactory.makeUsersDao();
    private authTokenDao = this.daoFactory.makeAuthTokenDao();
    private s3Dao = this.daoFactory.makeS3Dao();

    public async login(
        alias: string,
        password: string
    ): Promise<[User, AuthToken, string, boolean]> {
        let [user, _password] = await this.usersDao.getUserByHandle(alias);

        if (!user || !compareSync(password, _password)) {
            throw new Error("Invalid alias or password");
        }

        const authToken: AuthToken = AuthToken.Generate();
        await this.authTokenDao.putAuthToken(authToken.token);

        return [user, authToken, "Successful Login", true];
    };

    public async logout(authToken: AuthToken): Promise<[string, boolean]> {
        await this.authTokenDao.deleteAuthToken(
            authToken.token,
        );
        return ["Successful Logout", true]
    };

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        imageBytes: string
    ): Promise<[User, AuthToken, string, boolean]> {
        const imgUrl = await this.s3Dao.putImage(alias, imageBytes);

        const salt = genSaltSync(10);
        const user = await this.usersDao.putUser(
            new User(
                firstName,
                lastName,
                alias,
                imgUrl,
            ),
            hashSync(password, salt),
        );

        if (!user) {
            throw new Error("Invalid registration");
        }

        const authToken: AuthToken = AuthToken.Generate();
        await this.authTokenDao.putAuthToken(authToken.token);

        return [user, authToken, "Successful Registration", true];
    };
}