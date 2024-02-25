import {Buffer} from "buffer";
import {AuthToken, User} from "tweeter-shared";
import {AuthenticateService} from "../../model/AuthenticateService";
import {Presenter, View} from "../Presenter";

export interface RegisterView extends View {
    setImageBytes: (bytes: Uint8Array) => void,
    imageUrl: string,
    setImageUrl: (url: string) => void,
    authenticate: (user: User, authToken: AuthToken) => void,
    navigateTo: (url: string) => void
}

export class RegisterPresenter extends Presenter<RegisterView>
{
    private service: AuthenticateService;

    public constructor(view: RegisterView)
    {
        super(view);
        this.service = new AuthenticateService();
    }

    public handleImageFile(file: File | undefined)
    {
        if(file)
        {
            this.view.setImageUrl(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const imageStringBase64 = event.target?.result as string;

                // Remove unnecessary file metadata from the start of the string.
                const imageStringBase64BufferContents =
                    imageStringBase64.split("base64,")[1];

                const bytes: Uint8Array = Buffer.from(
                    imageStringBase64BufferContents,
                    "base64"
                );

                this.view.setImageBytes(bytes);
            };
            reader.readAsDataURL(file);
        }
        else
        {
            this.view.setImageUrl("");
            this.view.setImageBytes(new Uint8Array());
        }
    }

    public async register(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array)
    {
        await this.reportFailingAction(async () => {
            let [user, authToken] = await this.service.register(
                firstName,
                lastName,
                alias,
                password,
                imageBytes
            );

            this.view.authenticate(user, authToken);
            this.view.navigateTo("/");
        }, 'register user');
    }
}