import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "../userInfo/UserInfoHook";
import {PostStatusPresenter, PostStatusView} from "../../presenter/main/PostStatusPresenter";

interface Props {
    presenter?: PostStatusPresenter;
}

const PostStatus = (props: Props) => {
    const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } =
    useToastListener();

    const { currentUser, authToken } = useUserInfoHook();
    const [post, setPost] = useState("");

    const checkButtonStatus: () => boolean = () => {
        return !post.trim() || !authToken || !currentUser;
    };

    const listener: PostStatusView = {
        setPost: setPost,
        displayInfoMessage: displayInfoMessage,
        clearLastInfoMessage: clearLastInfoMessage,
        displayErrorMessage: displayErrorMessage,
    };

    const [presenter] = useState(props.presenter ?? new PostStatusPresenter(listener));

    return (
        <form>
            <div className="form-group mb-3">
                <textarea
                    className="form-control"
                    id="postStatusTextArea"
                    aria-label={'post-textarea'}
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
                    aria-label={'post-status'}
                    className="btn btn-md btn-primary me-1"
                    type="button"
                    disabled={checkButtonStatus()}
                    onClick={(event) =>
                    {
                        event.preventDefault();
                        presenter.postStatus(post, currentUser, authToken)
                    }}
                >
                    Post Status
                </button>
                <button
                    id="clearStatusButton"
                    aria-label={'clear-status'}
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
