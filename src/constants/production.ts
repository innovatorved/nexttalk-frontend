export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const DATABASE_URL = process.env.MONGO_DATABASE_URL as string;

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET as string;

export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

export const BACKEND_ENDPOINT = 'https://backend.nexttalk.vedgupta.in/graphql';
export const WS_ENDPOINT = 'wss://backend.nexttalk.vedgupta.in/graphql/subscriptions';
export const DOMAIN = 'backend.nexttalk.vedgupta.in';
export const NODE_ENV = process.env.NODE_ENV || 'production';
