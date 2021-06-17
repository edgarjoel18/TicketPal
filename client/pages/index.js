import buildClient from "../api/buildClient";
const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

// Specific to nextjs. nextjs will call this function while it is retrieving data from the server. An async request.
LandingPage.getInitialProps = async ({ req }) => {
  // Note: this returns a configured axios
  const configuredAxios = buildClient({ req });
  const { data } = await configuredAxios.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
