"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const graphql_request_1 = require("graphql-request");
const type_graphql_1 = require("type-graphql");
let Product = class Product {
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Product.prototype, "channel", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
Product = __decorate([
    type_graphql_1.ObjectType()
], Product);
let Order = class Order {
    get itemCount() {
        return this.items.length;
    }
};
__decorate([
    type_graphql_1.Field(type => type_graphql_1.ID),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], Order.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(type => [Product]),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    type_graphql_1.Field(type => type_graphql_1.Int),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Order.prototype, "itemCount", null);
Order = __decorate([
    type_graphql_1.ObjectType()
], Order);
const orders = [
    {
        id: 'SI0001',
        name: 'ashneil',
        items: ['wm7pro', 'asjkldhga', 'bucvxxcoj']
    },
    {
        id: 'SI0002',
        name: 'aram',
        items: ['wm7pro', 'bucvxxcoj']
    },
    {
        id: 'SI0003',
        name: 'shane',
        items: ['bucvxxcoj']
    }
];
const products = [
    {
        sku: 'wm7pro',
        channel: 'ashneil',
        title: 'cool washing machine'
    },
    {
        sku: 'asjkldhga',
        channel: 'aram',
        title: 'nice boat'
    },
    {
        sku: 'bucvxxcoj',
        channel: 'shane',
        title: 'fast bicycle'
    }
];
async function main() {
    // define resolvers
    let OrderResolver = class OrderResolver {
        async orders() {
            return orders; // this won't return Order.items correctly
        }
        async order(id) {
            return orders.find(o => o.id === id);
        }
        async items(order) {
            return order.items.map(sku => products.find(p => p.sku === sku));
        }
    };
    __decorate([
        type_graphql_1.Query(returns => [Order]),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], OrderResolver.prototype, "orders", null);
    __decorate([
        type_graphql_1.Query(returns => Order),
        __param(0, type_graphql_1.Arg('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], OrderResolver.prototype, "order", null);
    __decorate([
        type_graphql_1.FieldResolver(),
        __param(0, type_graphql_1.Root()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Order]),
        __metadata("design:returntype", Promise)
    ], OrderResolver.prototype, "items", null);
    OrderResolver = __decorate([
        type_graphql_1.Resolver(of => Order)
    ], OrderResolver);
    let ProductResolver = class ProductResolver {
        async product(sku) {
            return products.find(p => p.sku === sku);
        }
    };
    __decorate([
        type_graphql_1.Query(returns => Product),
        __param(0, type_graphql_1.Arg('sku')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], ProductResolver.prototype, "product", null);
    ProductResolver = __decorate([
        type_graphql_1.Resolver(of => Product)
    ], ProductResolver);
    const { typeDefs, resolvers } = await type_graphql_1.buildTypeDefsAndResolvers({
        resolvers: [OrderResolver, ProductResolver],
    });
    // create express server and add middleware
    const server = new apollo_server_express_1.ApolloServer({ typeDefs, resolvers });
    const app = express_1.default();
    server.applyMiddleware({ app });
    app.listen({ port: 4000 }, () => console.log(`Apollo http://127.0.0.1:4000${server.graphqlPath}`));
    const client = new graphql_request_1.GraphQLClient('http://127.0.0.1:4000/graphql', { headers: {} });
    console.log(await client.request(apollo_server_express_1.gql `
        {
            order(id: "SI0003"){
                id,
                name
            }
        }
    `));
}
main().then(console.log).catch(console.error);
//# sourceMappingURL=index.js.map