import "reflect-metadata";
import 'module-alias/register';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLClient } from 'graphql-request';
import { buildTypeDefsAndResolvers } from "type-graphql";
import { OrderResolver } from "@resolvers/order.resolver";
import { ProductResolver } from "@resolvers/product.resolver";
import { container } from "tsyringe";


async function main() {

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