import { products } from "raw-data";
import { Service } from "typedi";


@Service()
export class ProductService {

    constructor() {}

    getProducts(){
        return products;
    }

    getProduct(sku: string){
        return products.find(p => p.sku === sku);
    }
}