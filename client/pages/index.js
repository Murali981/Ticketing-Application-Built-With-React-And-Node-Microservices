import axios from "axios";

const LandingPage = ({ currentUser }) => {
  axios.get("/api/users/currentuser");
  return <h1>This is a Landing page</h1>;
};

// LandingPage.getInitialProps = async () => {
//   const response = await axios.get("/api/users/currentuser");

//   return response.data;
// };

export default LandingPage;
