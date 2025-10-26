import nats from "node-nats-streaming";

console.clear();

// We are going to create a client which is going to interact with the NATS Streaming Server.

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

// After the stan which is the client in our case successfully connects to the NATS Streaming Server,
// Then it is going to emit a connect event.
stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  }); // This is the information we want to publish to the NATS Streaming Server about the ticket being created. To the
  // NATS streaming server we can't directly share a plane JavaScript object. So we have to convert it to JSON which is a
  // plain string.

  stan.publish("ticket:created", data, () => {
    console.log("Event published"); // This callback function is going to be called when the event has been successfully published.
  });

  // We are going to close the connection after a small delay.
  setTimeout(() => {
    stan.close();
  }, 500);
});
