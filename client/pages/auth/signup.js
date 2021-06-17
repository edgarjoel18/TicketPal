import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await doRequest();
      Router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>Email address</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className="m-2 btn btn-primary" onClick={handleSubmit}>
        Sign up
      </button>
    </form>
  );
};
