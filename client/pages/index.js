import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
};

// LandingPage.getInitialProps = async ({ req }) => {
//   // console.log(req.headers); // Log the headers to see if the Host header is present
//   if (typeof window === "undefined") {
//     // We are on the server side. So the requests will be made to the ingress-nginx-controller service.
//     const { data } = await axios.get(
//       "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
//       {
//         headers:
//           // Host: "ticketing.dev", // This is the host header that the ingress controller expects
//           req.headers,
//       }
//     );
//     return data;
//   } else {
//     // We are on the browser side. So the requests will be made to the same domain.
//     const { data } = await axios.get("/api/users/currentuser");
//     return data;
//   }
// };

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  console.log("Context:", context);
  const client = buildClient(context);
  // This will use the buildClient function to create an axios instance
  const { data } = await client.get("/api/users/currentuser");
  return data; // This will return the current user data
  // If you want to return other props, you can return an object like this:
};

export default LandingPage;
