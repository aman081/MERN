require('dotenv').config();

console.log('🔍 Checking Environment Variables...\n');

console.log('📋 Environment Variables:');
console.log('PORT:', process.env.PORT || 'Not set (will use default 5000)');
console.log('NODE_ENV:', process.env.NODE_ENV || 'Not set (will use development)');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Not set');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Not set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set (will use default)');

if (!process.env.MONGODB_URI) {
  console.log('\n❌ MONGODB_URI is not set!');
  console.log('📝 Please create a .env file with:');
  console.log('MONGODB_URI=mongodb+srv://aman:AMan%40%2396@cluster0.nnzxj6u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
} else {
  console.log('\n✅ Environment looks good!');
  console.log('🚀 Ready to run tests and start server');
} 