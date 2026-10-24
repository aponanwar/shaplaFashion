// lib/db.ts
// MongoDB connection optimized for free tier (max 500 connections)
// Connection pooling: maxPoolSize=10 means multiple serverless function calls
// reuse the same pool instead of opening new connections.

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'shapla_fashion';

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache to reuse connection across hot-reloads in dev
// and across serverless function invocations in production
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB_NAME,
      // Free tier optimization — keep pool small
      maxPoolSize: 10,
      minPoolSize: 1,
      // Release idle connections quickly
      maxIdleTimeMS: 30_000,
      // Fail fast if DB is unreachable
      serverSelectionTimeoutMS: 5_000,
      socketTimeoutMS: 30_000,
      // Retry writes for reliability
      retryWrites: true,
      // Compress data over the wire
      compressors: ['zlib'],
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
