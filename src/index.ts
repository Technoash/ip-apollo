import "reflect-metadata";
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLClient } from 'graphql-request';
import { Arg, buildTypeDefsAndResolvers, Field, FieldResolver, ObjectType, Query, Resolver, ID, Root, Int } from "type-graphql";

@ObjectType()
class Product {
    @Field(type => ID)
    sku: string;

    @Field()
    channel: string;

    @Field()
    title: string;
}

@ObjectType()
class Order {
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
]


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
]

async function main() {

    // define resolvers
    @Resolver(of => Order)
    class OrderResolver {

        @Query(returns => [Order])
        async orders() {
            return orders; // this won't return Order.items correctly
        }

        @Query(returns => Order)
        async order(@Arg('id') id: string) {
            return orders.find(o => o.id === id); 
        }

        @FieldResolver()
        async items(@Root() order: Order): Promise<Product[]> {
            return order.items.map(sku => products.find(p => p.sku === sku));
        }
    }

    @Resolver(of => Product)
    class ProductResolver {
        @Query(returns => Product)
        async product(@Arg('sku') sku: string): Promise<Product> {
            return products.find(p => p.sku === sku);
        }
    }

    const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
        resolvers: [OrderResolver, ProductResolver],
    });


    // create express server and add middleware
    const server = new ApolloServer({ typeDefs, resolvers });
    const app = express();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log(`Apollo http://127.0.0.1:4000${server.graphqlPath}`)
    );

    // test query
    const client = new GraphQLClient('http://127.0.0.1:4000/graphql', { headers: {} })
    console.log(await client.request(gql`
        {
            order(id: "SI0003"){
                id,
                name
            }
        }
    `));
}

main().then(console.log).catch(console.error);