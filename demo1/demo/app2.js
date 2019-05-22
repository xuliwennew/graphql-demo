const express = require("express")
const graphql = require("graphql")
const graphqlHTTP = require("express-graphql")


// 1. 先定义数据 & 操作数据的 resolvers
let users = [
    { id: 0, name: 'Tom', sex: 0, },
    { id: 1, name: 'Bob', sex: 0, },
    { id: 2, name: 'Alick', sex: 1, },
];

const userResolver = ({id}) => users.filter(u => u.id == id)[0];
const usersResolver = () => users;

// 2. 利用 GraphQLObjectType 定义 data 的 TypeDefs

const userType = new graphql.GraphQLObjectType({
    name: 'user',
    fields: {
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
        sex: { type: graphql.GraphQLInt },
    }
})
const usersType = new graphql.GraphQLList(userType)

// 3. 再利用 GraphQLObjectType 定義 Query 的 TypeDefs 且將 resolvers 定義在其中

const queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
        user: {
            type: userType,
            resolve: (_, args) => userResolver(args),
            args: {
                id: { type: graphql.GraphQLInt }
            },
        },
        users: {
            type: usersType,
            resolve: () => usersResolver()
        }
    }
})

// 4. 利用 GraphQLSchema 將 Query 封裝成 Schema

const schema = new graphql.GraphQLSchema({
    query: queryType
});

// 5. 利用 graphqlHTTP 將 Schema 封裝成 API
const app = express()
app.use(
    '/',
    graphqlHTTP({
        schema: schema,
        graphiql: true
    })
);

app.listen(4003)
