import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

async function testConnections() {
  console.log('--- TESTING CONNECTIONS ---');

  // 1. Test MongoDB
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || 'shapla_fashion';

  console.log('MongoDB URI present:', !!mongoUri);
  console.log('Target DB name:', dbName);

  let mongoSuccess = false;
  let mongoDetails = '';

  if (mongoUri) {
    try {
      console.log('Connecting to MongoDB...');
      const conn = await mongoose.connect(mongoUri, {
        dbName,
        serverSelectionTimeoutMS: 10000,
      });

      const readyState = mongoose.connection.readyState;
      const host = mongoose.connection.host;
      const connectedDb = mongoose.connection.name;

      if (readyState === 1) {
        mongoSuccess = true;
        mongoDetails = `Connected successfully! Host: ${host}, Database: ${connectedDb}`;
        console.log('✅ MongoDB:', mongoDetails);
      } else {
        mongoDetails = `Connection readyState is ${readyState}`;
        console.log('⚠️ MongoDB:', mongoDetails);
      }
      await mongoose.disconnect();
    } catch (err: any) {
      mongoDetails = err.message;
      console.error('❌ MongoDB Connection Error:', err.message);
    }
  } else {
    mongoDetails = 'MONGODB_URI not found in .env.local';
  }

  // 2. Test Cloudinary
  console.log('\n--- TESTING CLOUDINARY ---');
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.log('Cloud name:', cloudName);
  console.log('API key present:', !!apiKey);
  console.log('API secret present:', !!apiSecret);

  let cloudinarySuccess = false;
  let cloudinaryDetails = '';

  if (cloudName && apiKey && apiSecret) {
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });

      console.log('Pinging Cloudinary API...');
      const pingResult = await cloudinary.api.ping();
      console.log('Cloudinary ping response:', pingResult);

      if (pingResult.status === 'ok') {
        cloudinarySuccess = true;
        cloudinaryDetails = `Cloudinary account (${cloudName}) verified & ping OK!`;
        console.log('✅ Cloudinary:', cloudinaryDetails);
      } else {
        cloudinaryDetails = JSON.stringify(pingResult);
      }
    } catch (err: any) {
      cloudinaryDetails = err.message;
      console.error('❌ Cloudinary Error:', err.message);
    }
  } else {
    cloudinaryDetails = 'Cloudinary credentials missing';
  }

  console.log('\n=======================================');
  console.log(`MongoDB:    ${mongoSuccess ? '✅ CONNECTED' : '❌ FAILED'} (${mongoDetails})`);
  console.log(`Cloudinary: ${cloudinarySuccess ? '✅ CONNECTED' : '❌ FAILED'} (${cloudinaryDetails})`);
  console.log('=======================================');

  process.exit(mongoSuccess && cloudinarySuccess ? 0 : 1);
}

testConnections();
