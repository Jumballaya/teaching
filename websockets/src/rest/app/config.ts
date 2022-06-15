
const { env } = process;
export const config = {
  server: {
    port: env.PORT ? parseInt(env.PORT) : 3000,
    host: env.HOST ? env.HOST : 'localhost',
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: parseInt(env.JWT_EXPIRES_IN || '') ? parseInt(env.JWT_EXPIRES_IN || '') : 60000,
  },
  keyval: env.APP_KEYVAL ? env.APP_KEYVAL : 'keyval://keyvalue:9090',
  pubsub: env.APP_PUBSUB ? env.APP_PUBSUB : 'pubsub://pubsub:4567',
  database: env.APP_DATABASE ? env.APP_DATABASE : 'bongodb://database:27127',
}
