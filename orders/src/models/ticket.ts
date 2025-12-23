import mongoose from "mongoose";

interface TicketAttrs {}

interface TicketDoc extends mongoose.Document {}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}
