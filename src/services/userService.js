import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    id: user.email,
    email: user.email,
    password: user.password,
    name: user.email
  });
}
