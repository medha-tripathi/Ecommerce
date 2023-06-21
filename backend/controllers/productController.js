const Product = require('../models/productModel.js');
const errorMiddleware = require('../middleware/error.js');
const catchAsyncErrors = require('../middleware/catchAsyncError.js');
const ApiFeatures = require('../utils/apifeatures.js');

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user=req.user.id;
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 5;
    const productCount=await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

    const products = await apiFeature.query;

    res.status(200).json({
        success: true,
        products,
        productCount 
    })
})


exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    res.status(200).json({
        success: true,
        product
    })


})


exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    });

    res.status(201).json({
        success: true,
        product
    })
})


exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success: true,
        message: "Product deleted"
    })
})


exports.createProductReview=catchAsyncErrors(async(req,res,next)=>{
    const {rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };

    const product=await Product.findById(productId);

    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach((rev)=>{
            if(rev.user.toString()===req.user._id.toString()){
                rev.rating=rating;
                rev.comment=comment;
            }
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }

    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    })

    product.ratings=avg/product.reviews.length; 

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })
});


exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.id);

    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    res.status(200).json({
        success: true,
        reviews:product.reviews
    });
})


exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId);

    if (!product) {
        res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    const reviews=product.reviews.filter(rev=>rev._id.toString()!==req.query.toString())


    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    })

    const ratings=avg/reviews.length; 

    const numOfReviews=reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true,
        reviews:product.reviews
    });
})