import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class Product {
    @Field(type => ID)
    sku: string;

    @Field()
    channel: string;

    @Field()
    title: string;
}