import { notification } from "antd";

import Subscription from "@/models/subscription";
import stripe from "@/stripe/config";

// Stripe controller
export default class StripeController {
  // Create a checkout session
  static async checkoutSubscription(subscription: Subscription): Promise<boolean> {
    let result: boolean = true;
    try {
      if (subscription.stripeID) {
        await fetch("/api/payments/stripe/subscription", {
          "method": "POST",
          "headers": {
            "Content-Type": "application/json",
          },
          "body": JSON.stringify({
            "priceId": subscription.stripeID,
            "customerId": "cus_ObIrGzwpYW3bCK",
          }),
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message,
      });
      result = false;
    }

    return result;
  }
}