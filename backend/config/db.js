import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/creatorhub';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB Connected: ' + conn.connection.host);
    return conn;
  } catch (error) {
    console.warn('Direct MongoDB connection failed. Initializing MongoMemoryServer in-memory cluster...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      console.log('In-Memory MongoDB Connected: ' + conn.connection.host + ' (URI: ' + memUri + ')');
      return conn;
    } catch (memErr) {
      console.error('Fatal: Failed to start MongoDB memory server', memErr);
      process.exit(1);
    }
  }
};
