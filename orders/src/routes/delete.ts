import { natsWrapper } from "../nats-wrapper";
import express, { Request, Response } from "express";
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from "@ecticketsrecent/common";
import { Order } from "../../models/orders";
import { OrderStatus } from "../../models/orders";
import { OrderedCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderedCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
        version: order.__v!,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
