import kue from 'kue';

import redisConfig from './redis.json';

const queue = kue.createQueue({
  prefix: 'q',
  redis: {
    host: redisConfig.host,
    port: redisConfig.port,
    auth: redisConfig.auth,
    // db: 3, // if provided select a non-default redis db
    options: {
      // see https://github.com/mranney/node_redis#rediscreateclient
      retry_strategy(options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }

        console.log('Kue redis reconnected.');
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      },
    },
  },
});

export default queue;
