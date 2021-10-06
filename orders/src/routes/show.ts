import express, { Request, Response } from "express";
import {requireAuth, NotFoundError, NotAuthorizedError} from '@ecticketsrecent/common';
import { Order } from '../../models/orders';
const router = express.Router();

router.get("/api/orders/:orderId", requireAuth async (req: Request, res: Response) => {
  // .populate() gives us the associated ticket
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if(!order){
    throw new NotFoundError();
  }

  if(order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError
  }

  // Send 
  res.send(order);
});

export { router as showOrderRouter };
