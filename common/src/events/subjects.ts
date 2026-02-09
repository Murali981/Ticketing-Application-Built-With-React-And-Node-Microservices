// Subject in the world of NATS-streaming server is nothing but a channel name
// where messages are published to and subscribers listen to.
// Here we define all the subjects that our application will use.

// What is the use of enum in TypeScript?
// An enum (short for "enumeration") is a special data type in TypeScript that allows you to define a set of named constants.
// Enums are useful for representing a fixed number of related values, such as days of the week, directions, or in our case, event subjects.
//  They provide a way to give more meaningful names to these values, making the code easier to read and maintain.
// But why can't we write just export Subjects = { TicketCreated: "ticket:created", TicketUpdated: "ticket:updated", ... } instead of using enum?
// We could technically use a plain object to define our subjects, but using an enum provides several benefits:
// 1. Type Safety: Enums provide type safety, ensuring that only valid values can be assigned to variables of the enum type. With a plain object, you could accidentally assign an invalid string value.
// 2. Auto-completion: When using enums in an IDE, you get auto-completion for the enum values, which can help prevent typos and improve developer productivity.
// 3. Readability: Enums can make the code more readable by providing a clear and concise way to define a set of related constants. It also makes it clear that these values are meant to be used as a group of related options.
// 4. Reverse Mapping: Enums in TypeScript support reverse mapping, allowing you to get the name of an enum member from its value. This can be useful for debugging or logging purposes.
export enum Subjects {
  TicketCreated = "ticket:created",
  TicketUpdated = "ticket:updated",

  OrderCreated = "order:created",
  OrderCancelled = "order:cancelled",

  ExpirationComplete = "expiration:complete",

  PaymentCreated = "payment:created",
}

const printSubject = (subject: Subjects) => {};
