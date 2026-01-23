import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 }); // Why ! here? Because we are sure that firstInstance is not null
  secondInstance!.set({ price: 15 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error.
  try {
    await secondInstance!.save(); // Why this will throw an error? Because the version number has changed after the first save
    // so the second save will fail the version check and throw a version error.
  } catch (err) {
    return; // Test passes if error is thrown and caught here
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0); // Initial version should be 0
  await ticket.save();
  expect(ticket.version).toEqual(1); //     Version should increment to 1
  await ticket.save();
  expect(ticket.version).toEqual(2); //     Version should increment to 2
});
