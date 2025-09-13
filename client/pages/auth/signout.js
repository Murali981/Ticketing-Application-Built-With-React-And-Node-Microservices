import { useEffect } from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

export default () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      // Redirect to the home page after signing out
      //   window.location.href = "/";
      Router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
    // The doRequest function will be called when the component mounts
  }, []);

  return <div>Signing you out...</div>;
};
