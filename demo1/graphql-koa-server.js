const Koa = require("koa")
const {buildSchema} = require("graphql")
const Router = require("koa-router")
const graphqlHTTP = require("koa-graphql")
const Static = require("koa-static")


const app = new Koa()
const router = new Router()
app.use(Static(__dirname))

router.get("/",async (cxt)=>{
    cxt.body = "hello koa"
})

const schema = buildSchema(`

    type User {
      name:String,
      age:Int,
      sex:String
    }
   
    
    type Query {
        sayHello:[String],
        getUserById(id:Int!,name:String!):User
    }
    
    input UserInput {
       name:String,
       age:Int,
       sex:String
    }
    
    type Mutation {
        createUser(input:UserInput):User
    }
    
    
`
)

const root = {
    sayHello: ()=>{
        return [
            "hello koa graphql server api",
            "hello2"
        ]
    },
    getUserById:({id})=>{
        let users= [
            { name:"张三",age:20,sex:"male"},
            { name:"李四",age:21,sex:"female"}
        ]
       return users[id]
    },
    createUser:({input})=>{
        //database
        return input;
    }
}


router.all("/graphql",graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))


app.use(router.routes()).use(router.allowedMethods())

app.listen(8089,()=>{
    console.log("koa graphql server is ready on port 8089")
})
