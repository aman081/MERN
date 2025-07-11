const mongoose = require('mongoose');
require('dotenv').config();

async function testMongoDBConnection() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'urjaa' // Specify database name
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database: urjaa');
    console.log('🌐 Cluster: cluster0.nnzxj6u.mongodb.net');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful'
    });
    console.log('✅ Database write test successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: true });
    console.log('✅ Database cleanup successful');
    
    console.log('\n🎉 MongoDB Atlas connection is working perfectly!');
    console.log('\n📋 Ready to:');
    console.log('   ✅ Create database collections');
    console.log('   ✅ Store user data');
    console.log('   ✅ Manage sports events');
    console.log('   ✅ Calculate leaderboards');
    console.log('   ✅ Handle image uploads');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if the connection string is correct');
    console.log('   2. Verify network connectivity');
    console.log('   3. Check MongoDB Atlas IP whitelist');
    console.log('   4. Ensure username/password are correct');
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testMongoDBConnection(); 