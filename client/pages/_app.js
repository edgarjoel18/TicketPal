import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/buildClient";
import Header from "../components/header";
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};

// Note: appContext is different in a custom Page compared to a context in another page.
AppComponent.getInitialProps = async (appContext) => {
  const configuredAxios = buildClient(appContext.ctx);
  const { data } = await configuredAxios.get("/api/users/currentuser");
  // Note for our sign in and signup page we dont have initialProps set up so lets check if it is not null
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    pageProps,
    currentUser: data.currentUser,
  };
};

export default AppComponent;
