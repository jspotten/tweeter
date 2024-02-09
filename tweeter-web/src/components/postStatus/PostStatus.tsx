import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import {useUserInfoHook} from "../userInfo/UserInfoHook";
import {PostStatusPresenter, PostStatusView} from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
    const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

    const { currentUser, authToken } = useUserInfoHook();
    const [post, setPost] = useState("");

    const checkButtonStatus: () => boolean = () => {
        return !post.trim() || !authToken || !currentUser;
    };

    const listener: PostStatusView = {
        post: post,
        setPost: setPost,
        currentUser: currentUser,
        authToken: authToken,
        displayInfoMessage: displayInfoMessage,
        clearLastInfoMessage: clearLastInfoMessage,
        displayErrorMessage: displayErrorMessage,
    };

    const [presenter] = useState(new PostStatusPresenter(listener));

    return (
        <form>
            <div className="form-group mb-3">
                <textarea
                    className="form-control"
                    id="postStatusTextArea"
                    rows={10}
                    placeholder="What's on your mind?"
                    value={post}
                    onChange={(event) => {
                        setPost(event.target.value);
                    }}
                />
            </div>
            <div className="form-group">
                <button
                    id="postStatusButton"
                    className="btn btn-md btn-primary me-1"
                    type="button"
                    disabled={checkButtonStatus()}
                    onClick={(event) => presenter.submitPost(event)}
                >
                    Post Status
                </button>
                <button
                    id="clearStatusButton"
                    className="btn btn-md btn-secondary"
                    type="button"
                    disabled={checkButtonStatus()}
                    onClick={(event) => presenter.clearPost(event)}
                >
                    Clear
                </button>
            </div>
        </form>
    );
};

export default PostStatus;
