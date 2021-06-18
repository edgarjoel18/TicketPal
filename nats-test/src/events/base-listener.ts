import { Subjects } from "./subjects";
import { Message, Stan } from "node-nats-streaming";

/*
 * Event interface describes a generic type of event. It must be a part of the enum
 */
interface Event {
  subject: Subjects;
  data: any;
}

/**
 * Listener is defined to be part of the common module inorder to be easily extended.
 * Listener is a base case for different types of listeners this application is going
 * to have in the future.
 */
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: Message): void;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subcriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  /*
   * Listen method to setup the subscription when we get an incomming message
   *
   */

  listen() {
    const subcription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subcription.on("message", (msg: Message) => {
      console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  } // End of listen

  /**
   * parseMessage takes cary of dealing with the message as a string or buffer
   */
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  } // End of parseMessage
} // End of Listener
