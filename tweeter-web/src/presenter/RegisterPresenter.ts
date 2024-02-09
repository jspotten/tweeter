import {ChangeEvent} from "react";
import {Buffer} from "buffer";
import {RegisterService} from "../model/RegisterService";
import {AuthToken, User} from "tweeter-shared";

export interface RegisterView {
    firstName: string,
    lastName: string,
    alias: string;
    password: string;
    imageBytes: Uint8Array,
    setImageBytes: (bytes: Uint8Array) => void,
    imageUrl: string,
    setImageUrl: (url: string) => void,
    navigateTo: (url: string) => void
    updateUserInfo: (user1: User, user2: User, authToken: AuthToken, rememberMe: boolean) => void,
    displayErrorMessage: (msg: string) => void
}

export class RegisterPresenter
{
    private view: RegisterView;
    private service: RegisterService;

    public constructor(view: RegisterView)
    {
        this.view = view;
        this.service = new RegisterService();
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

    public async doRegister(rememberMe: boolean)
    {
        try
        {
            let [user, authToken] = await this.service.register(
                this.view.firstName,
                this.view.lastName,
                this.view.alias,
                this.view.password,
                this.view.imageBytes
            );

            this.view.updateUserInfo(user, user, authToken, rememberMe);
            this.view.navigateTo("/");
        }
        catch (error)
        {
            this.view.displayErrorMessage(
                `Failed to register user because of exception: ${error}`
            );
        }
    }
}