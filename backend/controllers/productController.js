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