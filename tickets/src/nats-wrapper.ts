import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan; // Here we are defining a private property called _client which is of type Stan or undefined.

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }
    return this._client; // Here we are returning the _client property. But before returning it we are checking if it is undefined. If it is undefined
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Connected to NATS");
        resolve();
      });
      this.client.on("error", (err) => {
        reject(err);
      }); // This is to handle any errors that might occur while trying to connect to the NATS streaming server.
    });
  }
}
export const natswrapper = new NatsWrapper(); // Here we are exporting a single instance of the NatsWrapper class.
// So wherever we import this natsWrapper we are going to get the exact same instance of this class. This is important because
// we want to maintain a single connection to the NATS streaming server across our entire application.
