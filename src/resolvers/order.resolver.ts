import { Order } from "@datatypes/order.type";
import { Product } from "@datatypes/product.type";
import { orders, products } from "../raw-data";
import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import { OrderService } from "@services/order.service";

@Service()
@Resolver(() => Order)
export class OrderResolver {

    constructor(
        private readonly orderService: OrderService
    ){}

    @Query(() => [Order])
    async orders() {
        return this.orderService.getOrders();
    }

    @Query(() => Order)
    async order(@Arg('id') id: string) {
        return this.orderService.getOrder(id);
    }

    @FieldResolver()
    async items(@Root() order: Order): Promise<Product[]> {
        return this.orderService.getProducts(order.id);
    }
}