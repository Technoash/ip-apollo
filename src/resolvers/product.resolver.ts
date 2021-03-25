import { Product } from "@datatypes/product.type";
import { products } from "../raw-data";
import { Arg, Query, Resolver } from "type-graphql";


@Resolver(() => Product)
export class ProductResolver {
    @Query(() => Product)
    async product(@Arg('sku') sku: string): Promise<Product> {
        return products.find(p => p.sku === sku);
    }
}