import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push("/orders"),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); // call it immediately to set the initial time left because
    // the first call to setInterval will happen after 1 second
    const timerId = setInterval(findTimeLeft, 1000); // call findTimeLeft every second to update the time left
    // Why we are assigning the return value of setInterval to a variable?
    // Because we need to clear the interval when the component unmounts to avoid memory leaks and
    // unnecessary function calls.

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return <div>Order expired</div>;
  }

  return (
    <div>
      {timeLeft} seconds left to pay for this order
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Q7cTISFEVzUW9BwdZHgLyR6WOr44geGtrcmDcDDE9cAB3zBhEiLshmQOIsg8qlD4FBD1GmNWLvKtfKOmcCSeo9v0057hr9k5Z"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
