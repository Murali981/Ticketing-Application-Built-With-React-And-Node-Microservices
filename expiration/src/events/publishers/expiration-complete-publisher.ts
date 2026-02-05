import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@mjtickets981/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
