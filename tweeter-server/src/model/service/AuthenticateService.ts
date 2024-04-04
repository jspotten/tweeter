import {AuthToken, User} from "tweeter-shared";
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import {Service} from "./Service";


export class AuthenticateService extends Service {
    private usersDao = this.daoFactory.makeUsersDao();
    private s3Dao = this.daoFactory.makeS3Dao();

    public async login(
        alias: string,
        password: string
    ): Promise<[User | null, AuthToken | null, string, boolean]> {
        let [user, _password] = await this.usersDao.getUserByHandle(alias);

        if (!user || !compareSync(password, _password)) {
            return [null, null, "Invalid alias or password", false];
        }

        const authToken: AuthToken = AuthToken.Generate();
        await this.authTokenDao.putAuthToken(authToken.token, user);

        return [user, authToken, "Successful Login", true];
    };

    public async logout(authToken: AuthToken): Promise<[string, boolean]> {
        await this.authTokenDao.deleteAuthToken(
            authToken.token,
        );
        return ["Successful Logout", true];
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
        await this.authTokenDao.putAuthToken(authToken.token, user);

        return [user, authToken, "Successful Registration", true];
    };
}