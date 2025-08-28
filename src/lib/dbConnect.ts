import mongoose from 'mongoose';

type connectionObject ={
    isConnected?: number;
};

const connection : connectionObject ={};

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('Already connected to the database')
        return;
    }

    try{
        // Attempt to connect to Databse
        const db = await mongoose.connect(process.env.MONGODB_URI as string || '', {})

        connection.isConnected = db.connections[0].readyState;

        // console.log(db.connections)

        console.log('Database connected successfully')

    }catch(error){
        console.error('Database connection failed', error)

        // Graceful exit in case of a connection error
        process.exit(1);
    }
}

export default dbConnect;