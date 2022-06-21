import Redis from 'ioredis';

const redis = new Redis(6379);
const sub = new Redis(6379);
const pub = new Redis(6379);

async function run() {
  try {
    //  await redis.set('name', 'Smiling.');
    await redis.set('name', 'Smiling.', 'EX', 10);
    const result = await redis.get('name');
    console.log(result);

    //  array
    await redis.lpush('software', 'mysql', 'mongodb');
    const arr = await redis.lrange('software', 0, 10);
    console.log(arr);

    //  object
    await redis.hmset('person', { name: 'smiling.', age: 27 });
    const obj = await redis.hgetall('person');
    console.log(obj);
    const name = await redis.hget('person', 'name');
    console.log('person name', name);

    //  发布/订阅
    //  订阅
    const r = await sub.subscribe('channel-1');
    console.log(r);
    sub.on('message', (channel, message) => {
      console.log(`Received ${message} from ${channel}`);
    });

    // 发布
    setTimeout(() => {
      pub.publish('channel-1', 'hello');
    }, 1000);


  } catch (e) {
    console.error(e);
  } finally {
    // redis.disconnect();
  }
}

run();
