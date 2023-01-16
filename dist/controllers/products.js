"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateProduct = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getAllProducts = exports.createProduct = void 0;
const productModel_1 = require("../model/productModel");
const utils_1 = require("../utils/utils");
const usersModel_1 = require("../model/usersModel");
const createProduct = async (req, res) => {
    try {
        const { _id, email } = req.user;
        const { error } = utils_1.productSchema.validate(req.body, utils_1.option);
        if (error)
            return res.status(400).json({ Error: error.details[0].message });
        const { name, brand, category, description, price, countInStock, } = req.body;
        const user = await usersModel_1.UserInstance.findOne({
            _id: _id,
        });
        if (user) {
            const product = await productModel_1.ProductInstance.create({
                name,
                image: req.file.path,
                brand,
                category,
                description,
                price,
                countInStock,
                authorId: _id,
            });
            return res.status(200).json({
                message: "Product created successfully",
                product
            });
        }
        return res.status(401).json({
            message: "not authorized"
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal Server error",
            route: "post/api/products/create-product"
        });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel_1.ProductInstance.find();
        return res.status(200).json({
            message: "got products successfully",
            products
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal server error"
        });
    }
};
exports.getAllProducts = getAllProducts;
const getProduct = async (req, res) => {
    try {
        const { email, _id } = req.user;
        const { productId } = req.params;
        const user = await usersModel_1.UserInstance.findOne({
            _id: _id
        });
        console.log(user);
        if (user) {
            const product = await productModel_1.ProductInstance.find({
                _id: productId
            });
            if (product) {
                return res.status(200).json({
                    message: "successfully got a product",
                    product
                });
            }
            return res.status(404).json({
                message: "product not fount",
            });
        }
        return res.status(401).json({
            message: "not authorized",
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal server error"
        });
    }
};
exports.getProduct = getProduct;
const updateProduct = async (req, res) => {
    try {
        const { _id, email } = req.user;
        const productId = req.params.id;
        const { rating, numReviews, countInstock, price } = req.body;
        const { error } = utils_1.updateProductSchema.validate(req.body, utils_1.option);
        if (error)
            return res.status(400).json({ Error: error.details[0].message });
        const user = await usersModel_1.UserInstance.findOne({
            email: email
        });
        if (user) {
            const updatadProduct = await productModel_1.ProductInstance.findOneAndUpdate({ _id: productId }, req.body, { new: true });
            if (updatadProduct) {
                return res.status(200).json({
                    message: "successfully got a product",
                    updatadProduct
                });
            }
            return res.status(404).json({
                message: "product not fount",
            });
        }
        return res.status(401).json({
            message: "not authorized",
        });
    }
    catch {
        return res.status(500).json({
            Error: "internal server error"
        });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const { _id } = req.user;
        const productId = req.params.id;
        const isUser = await usersModel_1.UserInstance.findOne({ _id: _id });
        if (isUser) {
            const deleteProduct = await productModel_1.ProductInstance.findByIdAndDelete({
                _id: productId,
            });
            if (deleteProduct) {
                return res.status(201).json({
                    message: "product deleted successfully",
                    deleteProduct
                });
            }
            return res.status(404).json({
                message: "product not found"
            });
        }
        return res.status(401).json({
            message: "not authorized"
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal server error"
        });
    }
};
exports.deleteProduct = deleteProduct;
const rateProduct = async (req, res) => {
    try {
        const { _id } = req.user;
        const { rating } = req.body;
        const { error } = utils_1.rateProductSchema.validate(req.body, utils_1.option);
        if (error)
            return res.status(400).json({ Error: error.details[0].message });
        const user = await usersModel_1.UserInstance.findOne({
            _id: _id
        });
        const productId = req.params.id;
        if (user) {
            const product = await productModel_1.ProductInstance.findById({
                _id: productId
            });
            if (product) {
                const updatedRating = Math.floor((parseInt(rating) + Number(product.rating)) / (Number(product.numReviews) + 1));
                const newReviews = product.numReviews + 1;
                const productRating = await productModel_1.ProductInstance.findByIdAndUpdate({ _id: productId }, { $set: {
                        rating: updatedRating,
                        numReviews: newReviews,
                    }
                }, { new: true });
                return res.status(201).json({
                    message: "product deleted successfully",
                    rating: productRating.rating
                });
            }
            return res.status(404).json({
                message: "product not found"
            });
        }
        return res.status(401).json({
            message: "not authorized"
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "internal server error"
        });
    }
};
exports.rateProduct = rateProduct;
//# sourceMappingURL=products.js.map