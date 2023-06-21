const express=require('express');
const errorMiddleware=require('./middleware/error.js')
const cookieParser=require('cookie-parser')

const app=express();
app.use(express.json());
app.use(cookieParser());

const product=require("./routes/productRoute")
app.use("/api/v1",product);

const user=require('./routes/userRoute.js')
app.use("/api/v1",user);

const order=require('./routes/orderRoute.js')
app.use("/api/v1",order);

app.use(errorMiddleware)

module.exports=app;