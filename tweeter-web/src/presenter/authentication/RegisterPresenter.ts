import {Buffer} from "buffer";
import {AuthenticationPresenter, AuthenticationView} from "./AuthenticationPresenter";
import {AuthToken, User} from "tweeter-shared";

export interface RegisterView extends AuthenticationView {
    setImageBytes: (bytes: Uint8Array) => void,
    imageUrl: string,
    setImageUrl: (url: string) => void,
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView>
{
    public constructor(view: RegisterView)
    {
        super(view);
    }

    protected get view()
    {
        return super.view as RegisterView
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
        await this.authenticate("/", firstName, lastName, alias, password, imageBytes)
    }

    protected validate(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array): Promise<[User, AuthToken]> {
        return this.service.register(
            firstName,
            lastName,
            alias,
            password,
            imageBytes
        );
    }

    protected getItemDetails(): string {
        return 'register user';
    }
}