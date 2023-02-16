const Order=require("../models/orderModel");
const Product=require("../models/productModel");
//Create New Order
exports.newOrder=async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
      const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
      });
      res.status(201).json(
        {
            success:true,
            order
        }
      )
}


// get Single Order
exports.getSingleOrder = async (req, res, next) => {

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Yes, it's a valid ObjectId, proceed with `findById` call.
const     order = await Order.findById(req.params.id).populate(
            "user",
            "name email"
          );
          res.status(200).json({
            success: true,
            order,
          });
      }
      else{
        res.status(500).json({
            success:false,
            message:"Order Not Found"
        })
      }
    // if (!order) {
    // return res.status(500).json({
    //     success:false,
    //     message:"Order Not Found"
    // })
    // }
  
   
  };
//Get loggedin User Order
// exports.myOrder=async(req,res,next)=>{
//     // console.log(req.user._id);
//     console.log("M")
// //     const orders = await Order.find({ user: req.user._id });

// //   res.status(200).json({
// //     success: true,
// //     orders,
// //   });
   
// }
exports.myOrder=async(req,res)=>{
    try{
        const orders = await Order.find({ user: req.user._id });

          res.status(200).json({
            success:true,
            orders
          })
    }
    catch(e){
res.status(500).json({
    success:false,
    message:e.message
})
    }
}
exports.getAllOrders=async(req,res)=>{
    try{
        let totalAmount=0;
        const order=await Order.find();
      
        order.forEach((order)=>{
            totalAmount+=order.totalPrice
        })
        res.status(200).json({
            success:true,
            order,
            totalAmount
        })
    }
    catch(e){
        return res.status(500).json({
            success:false,
            message:e.message
        })
    }
}
//Update Order Status
exports.updateOrder = async (req, res, next) => {
    try{
        const order = await Order.findById(req.params.id);
  
        if (!order) {
          return res.status(500).json({
            success:false,
            message:"Order Not Found"
          })
        }
      
        if (order.orderStatus === "Delivered") {
            return res.status(500).json({
                success:false,
                message:"Order already Delieverd"
              })
        }
      
        if (req.body.status === "Shipped") {
          order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
          });
        }
        order.orderStatus = req.body.status;
      
        if (req.body.status === "Delivered") {
          order.deliveredAt = Date.now();
        }
      
        await order.save({ validateBeforeSave: false });
        res.status(200).json({
          success: true,
        });
    }
    catch(e){
res.status(500).json({
    success:false,
    message:e.message 
})
    }
  
  };
  
  async function updateStock(id, quantity) {
    const product = await Product.findById(id);
  
    product.Stock -= quantity;
  
    await product.save({ validateBeforeSave: false });
  }
  
  // delete Order -- Admin
  exports.deleteOrder = async (req, res, next) => {
    try{
        const order = await Order.findById(req.params.id);
  
        if (!order) {
          return next(new ErrorHander("Order not found with this Id", 404));
        }
      
        await order.remove();
      
        res.status(200).json({
          success: true,
        });
    }
    catch(e){
        res.status(500).json({
            success:false,
            message:e.message
        })
    }
   
  };