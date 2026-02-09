import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  // method === "POST", "GET", "PUT", "PATCH", "UPDATE".....
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props });
      // Why we put ... for both body and props?
      // Because we want to merge the body and props objects into a single object that will be sent as the request body.
      // This allows us to pass additional data (like token from Stripe) when calling doRequest without having to modify
      // the original body object.

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response.data);
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  return { doRequest, errors };
};
