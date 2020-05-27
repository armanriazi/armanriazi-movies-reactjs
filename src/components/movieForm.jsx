import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { getMovie, saveMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";

class MovieForm extends Form {
  state = {
    data: {
      id:"",
      name:"",
      title: "",
      genreId: "",
      numberInStock: "",
      dailyRentalRate: "",
    },
    genres: [],
    errors: {},
  };

  schema = {
    id: Joi.string().min(3).max(25).label("ای دی"),
    name: Joi.string().required().label("اسم"),
    title: Joi.string().required().label("عنوان"),
    genreId: Joi.string().required().label("ژانر"),
    numberInStock: Joi.number()
      .required()
      .min(0)
      .max(100)
      .label("تعداد موجود در انبار"),
    dailyRentalRate: Joi.number()
      .required()
      .min(0)
      .max(10)
      .label("امتیاز روزانه امانت"),
  };

  async populateGenres() {
    const genres = await getGenres();
    const rows = genres.data.rows;
    let result = Object.create([]);
    rows.map((i) => result.push(i.doc));    
    this.state.genres=result;
    this.setState({ result });
  }

  async populateMovie() {
    try {
      const movieId = this.props.match.params.id;
      if (movieId === "new") return;

      const { data: movie } = await getMovie(movieId);      
      const rows = movie.data.rows;
      let result = Object.create([]);
      rows.map((i) => result.push(i.doc));          
      this.setState({ data: this.mapToViewModel(result) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  mapToViewModel(movie) {
    return {
      id: movie.id,
      name: movie.name,
      title: movie.title,
      genreId: movie.genre._id,
      numberInStock: movie.numberInStock,
      dailyRentalRate: movie.dailyRentalRate,
    };
  }

  doSubmit = async () => {    
    await saveMovie(this.state.data);
    this.props.history.push("/movies");
  };

  render() {
    return (
      <div>
        <h1>افزودن فیلم جدید</h1>
        <form onSubmit={this.handleSubmit}>
        {this.renderInput("id", "ای دی")}
        {this.renderInput("name", "اسم")}
          {this.renderInput("title", "عنوان")}
          {this.renderSelect("genreId", "ژانر", this.state.genres)}
          {this.renderInput("numberInStock", "تعداد در انبار", "number")}
          {this.renderInput("dailyRentalRate", "مقدار کرایه در روز")}
          {this.renderButton("ذخیره")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
