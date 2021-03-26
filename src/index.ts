import "reflect-metadata";
import 'source-map-support/register'
import 'module-alias/register';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { GraphQLClient } from 'graphql-request';
import { buildSchema } from "type-graphql";
import { OrderResolver } from "@resolvers/order.resolver";
import { ProductResolver } from "@resolvers/product.resolver";
import { Container } from "typedi";


async function main() {

    // create express server and add middleware
    // by passing in DI container and GraphQL resolvers
    const schema = await buildSchema({
        resolvers: [OrderResolver, ProductResolver],
        container: Container
    });
    const server = new ApolloServer({schema});
    const app = express();
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log(`Apollo http://127.0.0.1:4000${server.graphqlPath}`)
    );

    // test query
    const client = new GraphQLClient('http://127.0.0.1:4000/graphql', { headers: {} });
    console.log(await client.request(gql`
        {
            order(id: "SI0003"){
                id,
                name
            }
        }
    `));
}

main().then(console.log).catch(e =>{
    console.error('ERROR: Ending on rejection in main function', e);
    process.exit(1);
});

// AVOID SHENANIGANS
process.on('unhandledRejection', error => {
    console.error('ERROR: Ending on unhandled rejection', error);
    process.exit(1);
});
