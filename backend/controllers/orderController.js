const Order=require('../models/orderModel.js')
const catchAsyncErrors = require('../middleware/catchAsyncError.js');
const Product=require('../models/productModel.js')

exports.newOrder=catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;

    const order=await Order.create({shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt:Date.now(),user:req.user._id});

    res.status(201).json({
        success: true,
        order
    })
})


exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id).populate("user","name email");

    if (!order) {
        res.status(404).json({
            success: false,
            message: "Order not found"
        })
    }

    res.status(200).json({
        success: true,
        order
    });
});


exports.myOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find({user:req.user._id});

    res.status(200).json({
        success: true,
        orders
    });
});


exports.getAllOrders=catchAsyncErrors(async(req,res,next)=>{
    const orders=await Order.find();

    let totalAmount=0;

    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount, 
        orders
    });
});


exports.updateOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return res.status(400).json({
            success: false,
            message:"This order is not found"
        });
    }

    if(order.orderStatus==="Delivered"){
        return res.status(400).json({
            success: false,
            message:"This order is delivered"
        }); 
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity);
    })

    order.orderStatus=req.body.status;

    if(order.orderStatus==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave:false});
     
    res.status(200).json({
        success: true, 
    });
});

async function updateStock(id,quantity){
    const product=await Product.findById(id);
    product.stock=product.stock-quantity;
    await product.save({validateBeforeSave:false});
}



exports.deleteOrder=catchAsyncErrors(async(req,res,next)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        return res.status(400).json({
            success: false,
            message:"This order is not found"
        });
    }

    await Order.findByIdAndDelete({_id:req.params.id});

    res.status(200).json({
        success: true, 
        message:"This order is deleted"
    });
});
