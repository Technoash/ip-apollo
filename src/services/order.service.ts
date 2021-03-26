import { Product } from "@datatypes/product.type";
import { orders } from "raw-data";
import { Service } from "typedi";
import { ProductService } from "./product.service";


@Service()
export class OrderService {

    constructor(
        private readonly productService: ProductService
    ) {}


    getOrders(){
        return orders;
    }

    getOrder(id: string){
        return orders.find(o => o.id === id);
    }

    getProducts(id: string): Array<Product> {
        return this.getOrder(id).items.map(sku => this.productService.getProduct(id));
    }
}