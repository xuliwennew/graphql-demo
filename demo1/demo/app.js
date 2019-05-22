const express = require("express")
const {buildSchema} = require("graphql")
const graphqlHTTP = require("express-graphql")

//接口名：返回值
const schema = buildSchema(`

    type User {
       id:ID,
       name:String,
       status:Boolean,
       money:Float,
       hobby:[String],
       getName(id:ID):String
    },
    
    type Query {
       hello:String,
       world:Int,
       say(w:String!,d:Int):String,
       users(id:Int):[User]
    }
 `
)

const root = {
    hello:()=>{
        return "hello world!"
    },
    world:()=>{
        return 1
    },
    say:(args)=>{
        console.log(args)
       return "hello world";
    },
    users:({id})=>{
       let u = {
           id:1,
           name:"张三",
           status:false,
           money:1000.222,
           hobby:["football","bask"]
       }

       return [u]
    }
}



const app = express()

app.use("/",graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

app.listen("4001")
