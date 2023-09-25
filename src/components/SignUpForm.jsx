// Интерфейс для регистрации почты и пароля для нового пользователя
import * as React from "react";
import { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
// import TextField from '@mui/material/TextField';
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const theme = createTheme();

export default class SignUpForm extends Component {
  state = {
    email: "",
    password: "",
    repeatPassword: "",
  };

  // formData = new FormData();

  buildFormData = () => {
    const formData = new FormData();
    formData.append("email", this.state.email);
    formData.append("password", this.state.password);
    formData.append("repeatPassword", this.state.repeatPassword);
    // console.log(formData.get('email', this.state.email));
    // console.log(this.state.email);
    return formData;
  };

  componentDidMount() {
    ValidatorForm.addValidationRule("isNonEmpty", (value) => {
      if (value.trim() === "") {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule("confirmPassword", () => {
      if (this.state.password !== this.state.repeatPassword) {
        return false;
      }
      return true;
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const formData = this.buildFormData();
    // console.log(formData);
    axios
      .post(`http://localhost:4000/register`, {
        email: formData.get("email"),
        password: formData.get("password"),
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("newUser", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleContinueReg = () => {
    window.location.href = "/registration";
  };

  render() {
    const { email, password, repeatPassword } = this.state;
    // console.log(repeatPassword)

    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <Box
              // component="form"
              onSubmit={() => this.handleSubmit}
              noValidate
              sx={{ mt: 1, width: 400 }}
            >
              <ValidatorForm onSubmit={this.handleSubmit}>
                <TextValidator
                  // onChange={event => this.buildFormData(this.formData, event.target.value, "email") }
                  onChange={this.handleInputChange}
                  margin="normal"
                  // required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  autoFocus
                  validators={["required", "isEmail", "isNonEmpty"]}
                  errorMessages={[
                    "This field is required",
                    "Email is not valid",
                    "Enter your email, please",
                  ]}
                />
                <TextValidator
                  // onChange={event => this.buildFormData(this.formData, event.target.value, "password") }
                  onChange={this.handleInputChange}
                  margin="normal"
                  // required
                  fullWidth
                  name="password"
                  label="Create password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  validators={["required", "isNonEmpty"]}
                  errorMessages={[
                    "This field is required",
                    "Create password, please",
                  ]}
                />
                <TextValidator
                  onChange={this.handleInputChange}
                  margin="normal"
                  // required
                  fullWidth
                  name="repeatPassword"
                  label="Repeat password"
                  type="password"
                  id="repeatPassword"
                  autoComplete="current-password"
                  value={repeatPassword}
                  validators={["required", "isNonEmpty", "confirmPassword"]}
                  errorMessages={[
                    "This field is required",
                    "Repeat password, please",
                    "Incorrect password",
                  ]}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => { this.handleContinueReg()}}
                >
                  Continue registration
                </Button>
              </ValidatorForm>
              <Grid container>
                <Grid item>
                  <Link href="/" variant="body2">
                    {"Do you already have an account? Sign in"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box mt={8}></Box>
        </Container>
      </ThemeProvider>
    );
  }
}
