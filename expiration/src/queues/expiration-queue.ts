import Queue from "bull";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  // Here job is nothing but an object that contains the data we passed when we added the job to the queue
  console.log("Processing expiration for orderId:", job.data.orderId);
  // Add your expiration logic here
});

export { expirationQueue };
