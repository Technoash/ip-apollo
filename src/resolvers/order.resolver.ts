import { Order } from "@datatypes/order.type";
import { Product } from "@datatypes/product.type";
import { orders, products } from "../raw-data";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";


@Resolver(() => Order)
export class OrderResolver {

    @Query(() => [Order])
    async orders() {
        return orders; // this won't return Order.items correctly
    }

    @Query(() => Order)
    async order(@Arg('id') id: string) {
        return orders.find(o => o.id === id); 
    }

    @FieldResolver()
    async items(@Root() order: Order): Promise<Product[]> {
        return order.items.map(sku => products.find(p => p.sku === sku));
    }
}