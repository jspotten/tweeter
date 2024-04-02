export class FeedStatus {
    public constructor(
        public followerHandle: string,
        public timeStamp: number,
        public authorHandle: string,
        public status: string,
    ){}
}