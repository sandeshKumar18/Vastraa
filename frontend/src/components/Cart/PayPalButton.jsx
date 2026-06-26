import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";

const PayPalButton = ({ amount, onSuccess, onError }) => {
  console.log("amount" , amount)
  return (
    <PayPalButtons
      style={{ layout: "vertical", color: "gold", shape: "rect", label: "paypal" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: parseFloat(amount).toFixed(2),
              },
            },
          ],
          application_context: {
            shipping_preference: "NO_SHIPPING",
          },
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then((details) => {
          console.log("PayPal capture details:", details);
          onSuccess(details);
        });
      }}
      onCancel={() => {
        console.log("Payment cancelled by user");
      }}
      onError={(err) => {
        console.error("PayPal Checkout Error:", err);
        if (onError) onError(err);
      }}
    />
  );
};

export default PayPalButton;