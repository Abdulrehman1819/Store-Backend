const Product=require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");



//Create Product--Admin
exports.createProduct=async(req,res,next)=>{
  
    req.body.user=req.user.id;
 
const product=await Product.create(req.body);
res.status(201).json({
    success:true,
    product
})
}
exports.getAllProducts=async(req,res)=>{
    
    const resultperpage=8;
    const productcount=await Product.countDocuments();  
    const apifeature=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultperpage);
// const products=  await Product.find();
const products=await apifeature.query

 res.status(200).json({
  success:true,
  products,
  productcount
})
}
//Update Product --Admin
exports.updateProduct=async(req,res,next)=>{
//     let products=  await Product.findById(req.params._id);
// res.status(200).json({
//   success:true,
//   products
// })
const id=req.params.id;
    let product=await Product.findById(id);
  
    if(!product){
        return res.status(400).json({
            success:false,
            message:"Post Not Found"
        })
    }
    product=await Product.findByIdAndUpdate(id,req.body,{ //req.params ka jo cast error tha us ko id k equal kr k shi kiya hai
        new :true,
        runValidators:true,
        useFindAndModify:false
    }); 
    res.status(200).json({
        success:true,
        product
    })
    // let product = await Product.findById(req.params._id);

    // if (!product) {
    //   return next(new ErrorHander("Product not found", 404));
    // }
  
    // // Images Start Here
    // let images = [];
  
    // if (typeof req.body.images === "string") {
    //   images.push(req.body.images);
    // } else {
    //   images = req.body.images;
    // }
  
    // if (images !== undefined) {
    //   // Deleting Images From Cloudinary
    //   for (let i = 0; i < product.images.length; i++) {
    //     await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    //   }
  
    //   const imagesLinks = [];
  
    //   for (let i = 0; i < images.length; i++) {
    //     const result = await cloudinary.v2.uploader.upload(images[i], {
    //       folder: "products",
    //     });
  
    //     imagesLinks.push({
    //       public_id: result.public_id,
    //       url: result.secure_url,
    //     });
    //   }
  
    //   req.body.images = imagesLinks;
    // }
  
    // product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    //   useFindAndModify: false,
    // });
  
    // res.status(200).json({
    //   success: true,
    //   product,
    // });
}


exports.getProductDetails=async(req,res,next)=>{
console.log("Product getting Details")
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      product,
    });
}


exports.deleteProduct=async(req,res,next)=>{
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(500).json({
            success:false,
            message:"Product Not Found"
        })
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"Product Deleted Successfully"
    })
}

// Create and Update Product reviews
exports.createProductReview=async(req,res,next)=>{
    const {rating,comment,productId}=req.body;
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product=await Product.findById(productId);
    const isReviewd=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
    if(isReviewd){
product.reviews.forEach(rev => {
    if(rev.user.toString()===req.user._id.toString()){
rev.rating=rating,
rev.comment=comment
    }
   
});
    }
    else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg=avg+rev.rating
    })
    product.ratings=avg/product.reviews.length;
    await product.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,

    })
}
exports.getProductReviews=async(req,res)=>{
    const product=await Product.findById(req.query.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:"Product Not Found"
        })
    }
    res.status(200).json({
        success:true,
        message:product.reviews
    })
}
exports.deleteReview=async(req,res)=>{
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
}