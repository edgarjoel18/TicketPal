import axios from "axios";

/** A re-usable api to have axios decide to make a call to ingress by the server or browser*/
const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // We are on the server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // The browser takes care of all the headers
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
