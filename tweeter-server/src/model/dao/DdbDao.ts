import {DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

export class DdbDao {
    readonly marshallOptions = {
        // Whether to automatically convert empty strings, blobs, and sets to `null`.
        convertEmptyValues: false, // false, by default.
        // Whether to remove undefined values while marshalling.
        removeUndefinedValues: true, // false, by default.
        // Whether to convert typeof object to map attribute.
        convertClassInstanceToMap: true, // false, by default.
    };
    readonly unmarshallOptions = {
        // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
        wrapNumbers: false, // false, by default.
    };

    private client: DynamoDBDocumentClient | undefined = this.getClient()

    public getClient() {
        if(this.client === undefined)
        {
            this.client = DynamoDBDocumentClient.from(new DynamoDBClient(), {
                marshallOptions: this.marshallOptions,
                unmarshallOptions: this.unmarshallOptions,
            });
        }
        return this.client;
    }
}