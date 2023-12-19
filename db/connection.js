import { connect } from 'mongoose';

const uri = process.env.MONGO_STR;

const connectToDatabase = async () => {
  try {
    await connect(uri);
    console.log('DB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectToDatabase;
