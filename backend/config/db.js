import mongooose from 'mongoose';

const connectDb = async ()=>{
    try{
        mongooose.connect(process.env.MONGODB_URL);
        console.log("db connected");
    }catch(err){
        console.log(err);
    }
}

export default connectDb;