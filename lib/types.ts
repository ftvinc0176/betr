import mongoose from 'mongoose';

declare global {
  var mongoose: typeof globalThis.mongoose & {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

export {};
