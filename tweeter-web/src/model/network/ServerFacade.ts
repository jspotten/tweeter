import { AuthenticateResponse } from "tweeter-shared/dist/model/network/response/AuthenticateResponse";
import { LoginRequest} from "tweeter-shared/dist/model/network/request/LoginRequest"
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {

    private SERVER_URL = "TODO: Set this value.";

    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const endpoint = "/service/login";
        const response: JSON = await this.clientCommunicator.doPost<LoginRequest>(request, endpoint);

        return AuthenticateResponse.fromJson(response);
    }
}