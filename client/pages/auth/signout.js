import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
// Once the component is rendered we are going to useEffect to make a request to sign the user out

export default () => {
  const { doRequest, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing out...</div>;
};
