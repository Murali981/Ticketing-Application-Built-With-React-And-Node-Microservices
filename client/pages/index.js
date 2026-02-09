// import buildClient from "../api/build-client";
import Link from "next/link";
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/${ticket.id}`} as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
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

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // console.log("LANDING PAGE!");
  // console.log("Context:", context);
  // const client = buildClient(context);
  // // This will use the buildClient function to create an axios instance
  // const { data } = await client.get("/api/users/currentuser");
  // return data; // This will return the current user data
  // If you want to return other props, you can return an object like this:
  const { data } = await client.get("/api/tickets");

  return { tickets: data }; // This will return the tickets data as a prop
};

export default LandingPage;
