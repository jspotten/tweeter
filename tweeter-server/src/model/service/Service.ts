export abstract class Service {
    protected expirationTime = 120000;

    protected validateAuthToken(timestamp: number)
    {
        return Date.now() - timestamp > this.expirationTime
    }
}