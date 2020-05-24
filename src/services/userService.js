import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    id: user.id,
    email: user.username,
    password: user.password,
    name: user.name
  });
}
