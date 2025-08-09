import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import dashboardRouter from './routes/dashboardRoute.js'
import couponRoute from "./routes/couponRoute.js";


// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/dashboard', dashboardRouter)
app.use("/api/coupons", couponRoute);



app.get('/',(req,res)=>{
    res.send("API Working")
})

app.get("/api/product/:id", async (req, res) => {
    const { id } = req.params;
    console.log("Fetching product with ID:", id); // Debugging line

    try {
        const product = await productModel.findById(id);
        if (!product) {
            console.log("Product not found"); // Debugging line
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error fetching product:", error); // Debugging line
        res.status(500).json({ message: "Server Error" });
    }
});


app.listen(port, ()=> console.log('Server started on PORT : '+ port))