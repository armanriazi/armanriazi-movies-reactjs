import axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";
import { getCurrentUser, logout } from "./authService";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  (error) => {
    try {
      var current_time = new Date().getTime() / 1000;
      const exp = getCurrentUser().exp;

      if (current_time > exp) {
        toast.error("زمان شما به اتمام رسیده است لطفا مجدد وارد شوید");
        logout();
        Promise.reject(error);
        window.location = "/login";
      }
    } catch (e) {}

    const expectedError =
      error.response &&
      error.response.status === 4 &&
      error.response.status === 44 &&
      error.response.status === -4 &&
      error.response.status >= 400 &&
      error.response.status < 500;
    console.log(error);
    if (!expectedError) {
      logger.log(error);
      toast.error("خطایی بوجود آمد لطفا بعدا مراجعه فرمایید");
    }

    return Promise.reject(error);
  }
);

function setJwt(jwt) {
  axios.defaults.headers.common["x-auth-token"] = jwt;
  axios.defaults.headers.common["isAdmin"] = "Il!@#";
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};

/*

-1 = conflict rev of db
0 = not Ok of db for insert or delete

404 = Not found entity
4040 = Not found user
 40400 = user already registered
4041 = Not found customer
4042 = Not found genre
4043 = Not found movie
 40433 = Movie not in stock
4044 = Not found rental

4 = Please disable revison header
44 = Revison is not equal with database,please check your name
-4 = No provide revison

*/
