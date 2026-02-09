export enum OrderStatus {
  Created = "created", // When an order is created but not yet reserved. The ticket is still available for purchase.
  Cancelled = "cancelled", // When an order is cancelled. The ticket becomes available for purchase again.
  AwaitingPayment = "awaiting:payment", // When an order has been reserved and is waiting for payment. The ticket is no longer available for purchase.
  Complete = "complete", // When an order has been successfully paid for. The ticket is officially sold to the user.
}
