const express = require("express")
const path = require("path")
//使用graphql express中间件
const graphqlHTTP = require("express-graphql")
//引入 buildSchema
const {buildSchema} = require("graphql")


/**
 * step1: 创建接口规范 schema query/mutation
 * step2: 编写接口规范的对应的执行方法 resovle
 * step3: 使用接口规范创建接口服务器
 **/

const schema = buildSchema(`

    # 用户信息
    type User {
      name:String,
      age:Int,
      sex:String
    },
    
    type Query {
       # 根据编号获取一条用户信息 返回当前的用户信息
       getUserByID(id:Int):User,
       # 获取所有的用户信息
       getUsers:[User]
    },
    
    input UserInput {
      name:String,
      age:Int,
      sex:String
    }
    
    type Mutation {
       createUser(input:UserInput):User
    }
    
    
`)

const userList = [
    {
        name:"张三",
        age:20,
        sex:"男"
    },
    {
        name:"王五",
        age:21,
        sex:"男"
    }
]

//接口调用的方法
const root = {
    getUserByID:({id})=>{
        console.log(id)
      return new Promise((resolve, reject)=>{
          setTimeout(()=>{
              resolve(userList[id])
          },8000)
      })
    },
    getUsers:()=>{ //空函数必须这样写
       return userList
    },
    createUser:({input})=>{
        userList.push(input)
        return input
    }
}

const app = express()
app.use(express.static("public"))



app.use("/graphql",graphqlHTTP({
    schema:schema,
    rootValue:root,
    graphiql:true
}))

app.use("/users",(req,res)=>{
    res.json(userList)
})

app.use("/user/:id",(req,res)=>{
    console.log(req.params.id)
    res.json(userList[req.params.id])
})

app.use("/order",(req,res)=>{
    res.json([
        {
            userid:1,
            order:111212,
            products:[
                {
                    title:"apple tv"
                }
            ]
        }
    ])
})

app.listen(5000,()=>{
    console.log("graphql server is ready on port 5000")
})
