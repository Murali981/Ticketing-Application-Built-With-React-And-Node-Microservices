import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server side. So the requests will be made to the ingress-nginx-controller service.
    return axios.create({
      // This is how we will create pre configured version of axios
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We are on the browser side. So the requests will be made to the same domain.
    return axios.create({
      baseURL: "/", // Here we are using the same domain and no need to set headers beause the browser will automatically send the cookies.
    });
  }
};
