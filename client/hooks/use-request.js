import axios from "axios";
import { useState } from "react";

export default ({ url, method, body }) => {
  // method === "POST", "GET", "PUT", "PATCH", "UPDATE".....
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

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
        </div>
      );
    }
  };

  return { doRequest, errors };
};
