export class Follow {
    public constructor(
        public follower_handle: string,
        public followee_handle: string,
        public follower_name: string,
        public followee_name: string,
    ){}
}