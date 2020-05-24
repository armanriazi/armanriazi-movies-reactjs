import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import * as userService from "../services/userService";
import { toast } from "react-toastify";
//import auth from "../services/authService";

class RegisterForm extends Form {
  state = {
    data: { id:"",username: "", password: "" , name:""},
    errors: {},
  };

  schema = {
    id: Joi.string(),
    username: Joi.string().required().email().label("ایمیل"),
    password: Joi.string().required().min(5).max(25).label("رمز عبور"),
    name: Joi.string().min(5).max(25).label("نام"),
  };

  doSubmit = async () => {
    try {            
      userService.register(this.state.data).then(response=> {
        if(response.data.success) {
          toast.info("با موفقیت ثبت شد");          
          window.location = "/";
        } 
        else  toast.error("لطفا نام کاربری دیگری را انتخاب نمایید. بعدا مراجعه فرماپید");

      });                 
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div>
        <h1>عضویت</h1>
        <form onSubmit={this.handleSubmit}>
        {this.renderInput("id", "id")}
          {this.renderInput("username", "ایمیل")}
          {this.renderInput("password", "رمز عبور", "password")}
          {this.renderInput("name", "نام")}
          {this.renderButton("تایید عضویت")}
        </form>
      </div>
    );
  }
}

export default RegisterForm;
