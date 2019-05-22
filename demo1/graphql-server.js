const path = require("path")
const express = require("express")
const {buildSchema} = require("graphql")
const graphqlHTTP = require("express-graphql")

/**
 *  1, 定义schema query mutation
 *  2, 针对定义好的接口编写 resovler
 *  3, 使用graphqlHTTP 创建一个支持graqhql请求的服务器
 *
 */

const schema = buildSchema(`
     type Query {
        sayHello:String
     
     }
`)

const root = {
    sayHello:()=>{
        return "hello graphql server!"
    }
}


const app = express()

app.use("/graphql",graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

app.use("/",(req,res)=>{
    res.json({"code":200})
})


app.listen(8081,()=>{
    console.log("graphql server is ready on port 8081")
})
