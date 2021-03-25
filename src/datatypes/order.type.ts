import { Field, ID, Int, ObjectType } from "type-graphql";
import { Product } from '@datatypes/product.type';


@ObjectType()
export class Order {
    @Field(type => ID)
    id: string;

    @Field()
    name: string;

    @Field(type => [Product])
    items: string[];

    @Field(type => Int)
    get itemCount(){ 
        return this.items.length;
    }
}