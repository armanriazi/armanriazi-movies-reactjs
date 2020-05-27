import React from "react";
import { Redirect } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "../services/authService";
import { toast } from "react-toastify";

class LoginForm extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {},
  };

  schema = {
    email: Joi.string().required().label("ایمیل"),
    password: Joi.string().required().label("رمز عبور"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      auth.login(data.email, data.password).then((response) => {
        if (response.data.success) {
          toast.info("با موفقیت ثبت شد");
          localStorage.setItem("token", response.data.token);
          const { state } = this.props.location;
          window.location = state ? state.from.pathname : "/";
        } else toast.error("از ورود اطلاعات خود اطمینان حاصل نمایید");
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.email = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    if (auth.getCurrentUser()) return <Redirect to="/" />;

    return (
      <div>
        <h1>ورود</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("email", "ایمیل")}
          {this.renderInput("password", "‍رمز عبور", "password")}
          {this.renderButton("ورود")}
        </form>
      </div>
    );
  }
}

export default LoginForm;
