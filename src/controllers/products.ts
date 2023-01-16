import {Request, Response} from 'express';
import { ProductAttributes, ProductInstance } from '../model/productModel';
import { productSchema , option, updateProductSchema, rateProductSchema} from '../utils/utils';
import { JwtPayload } from 'jsonwebtoken'
import { UserInstance, UserAttributes } from '../model/usersModel';

export const createProduct = async (req:JwtPayload, res:Response) => {
	try{
		const {_id, email} = req.user
		const { error } = productSchema.validate(req.body, option);

      	if(error) return res.status(400).json({Error: error.details[0].message});

		const {
			name,
			brand,
			category,
			description,
			price,
			countInStock,
		} = req.body;


		
		const user = await UserInstance.findOne({
			_id:_id,
		}) as unknown as UserAttributes;

		if(user){
			const product = await ProductInstance.create(
				{
					name,
					image: req.file.path,
					brand,
					category,
					description,
					price,
					countInStock,
					authorId: _id,
				}
				) as unknown as ProductAttributes;
			return res.status(200).json({
				message: "Product created successfully",
				product

			})
		}
		return res.status(401).json({
			message: "not authorized"
		})

	}catch(err){
		res.status(500).json({
			Error: "Internal Server error",
			route: "post/api/products/create-product"
		})
	}
};

export const getAllProducts = async (req:Request, res:Response) => {
	try{
		const products = await ProductInstance.find();
		return res.status(200).json({
			message:"got products successfully",
			products
		})
	}catch(err){
		return res.status(500).json({
			Error: "internal server error"
		})
	}
};

export const getProduct = async (req:JwtPayload, res:Response) => {
	try{
		const { email,_id } = req.user;
		const { productId } = req.params;
		
		const user = await UserInstance.findOne({
			_id:_id
		}) as unknown as UserAttributes;

		console.log(user)
		if(user) {
			const product = await ProductInstance.find({
				_id:productId
			}) as unknown as ProductAttributes;

			if(product){
				return res.status(200).json({
					message: "successfully got a product",
					product
				})
			}

			return res.status(404).json({
				message: "product not fount",
			})
		}
		return res.status(401).json({
			message: "not authorized",
		})

	}catch(err){
		return res.status(500).json({
			Error: "internal server error"
		})
	}
};

export const updateProduct = async (req:JwtPayload, res:Response) => {
	try{
		const {_id, email} = req.user;
		const productId  = req.params.id
		const { rating, numReviews, countInstock, price } = req.body
		const { error } = updateProductSchema.validate(req.body, option);

      	if(error) return res.status(400).json({Error: error.details[0].message});
	
		const user = await UserInstance.findOne({
			email:email
		}) as unknown as UserAttributes;

		if(user){
			const updatadProduct = await ProductInstance.findOneAndUpdate(
				{_id:productId},
				req.body,
				{new:true}
			) as unknown as ProductAttributes;

			if(updatadProduct){
				return res.status(200).json({
					message: "successfully got a product",
					updatadProduct
				})
			}
			return res.status(404).json({
				message: "product not fount",
			})
		}
		return res.status(401).json({
			message: "not authorized",
		})

	}catch{
		return res.status(500).json({
			Error: "internal server error"
		})
	}
	
};

export const deleteProduct = async (req:JwtPayload, res:Response) => {
	try{
		const {_id} = req.user;
		const productId = req.params.id;
		const isUser = await UserInstance.findOne({ _id: _id})

		if(isUser){
			const deleteProduct = await ProductInstance.findByIdAndDelete({
				_id:productId,
			})

			if(deleteProduct) {
				return res.status(201).json({
					message: "product deleted successfully",
					deleteProduct
				})
			}
			return res.status(404).json({
				message: "product not found"
			})
		}
		return res.status(401).json({
			message: "not authorized"
		})

	}catch(err){
		return res.status(500).json({
			Error: "internal server error"
		})
	}
};

export const rateProduct = async (req:JwtPayload, res:Response) => {
	try{
		const { _id } = req.user;
		const { rating } = req.body;
		const { error } = rateProductSchema.validate(req.body, option);
      	if(error) return res.status(400).json({Error: error.details[0].message});

		const user = await UserInstance.findOne({
			_id:_id
		})

		const productId  = req.params.id
		if(user){
			const product = await ProductInstance.findById({
				_id:productId
			});
			if (product) {
				const updatedRating = Math.floor((parseInt(rating) + Number(product.rating)) / (Number(product.numReviews) + 1));
				const newReviews = product.numReviews + 1;
				const productRating = await ProductInstance.findByIdAndUpdate(
					{_id:productId},
					{$set: {
						rating:updatedRating,
						numReviews:newReviews,
					}
					},
					{new:true}
				) as unknown as ProductAttributes;
				return res.status(201).json({
					message: "product deleted successfully",
					rating:productRating.rating
				})
			}
			return res.status(404).json({
				message: "product not found"
			})
		}
		return res.status(401).json({
			message: "not authorized"
		})
	}catch(err){
		return res.status(500).json({
			Error: "internal server error"
		})
	}
};

