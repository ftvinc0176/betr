declare global {
  var mongoose: typeof globalThis.mongoose & {
    conn: unknown | null;
    promise: Promise<unknown> | null;
  };
}

export {};
