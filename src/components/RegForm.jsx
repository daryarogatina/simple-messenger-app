import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
// import Link from '@mui/material/Link';
// import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { Component } from "react";
import { DatePicker } from "@mui/x-date-pickers";
// import moment from "moment/moment";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

const theme = createTheme();

export default class RegForm extends Component {
  state = {
    firstName: "",
    lastName: "",
    city: "",
    birthDate: "",
  };

  formData = new FormData();

  componentDidMount() {
    let email = localStorage.getItem("newUser");
    console.log(email);
    axios
      .get(`http://localhost:4000/register?email=${email}`)
      .then((response) => {
        console.log(response);
        localStorage.setItem("userId", response.data[0]?.id);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  notEmptyValidate = ValidatorForm.addValidationRule("isNonEmpty", (value) => {
    if (value.trim() === "") {
      return false;
    }
    return true;
  });

  buildFormData = () => {
    const formData = new FormData();
    formData.append("firstName", this.state.firstName);
    formData.append("lastName", this.state.lastName);
    formData.append("city", this.state.city);
    formData.append("birthDate", this.state.birthDate);
    // console.log(this.state.birthDate);
    return formData;
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const formData = this.buildFormData();
    console.log(formData);
    let id = localStorage.getItem("userId");
    // console.log(formData.get("birthDate"));
    axios
      .post(`http://localhost:4000/update?id=${id}`, {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        city: formData.get("city"),
        birthDate: formData.get("birthDate"),
      })
      .then(function (response) {
        console.log(response);
        localStorage.setItem("UserData", response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  
  handleContinue = () => {
    window.location.href = "/";
  };

  render() {
    const { firstName } = this.state;
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
              Sign up
            </Typography>
            <Box onSubmit={() => this.handleSubmit} noValidate sx={{ mt: 1 }}>
              <ValidatorForm onSubmit={this.handleSubmit}>
                <TextValidator
                  onChange={this.handleInputChange}
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  autoComplete="firstName"
                  autoFocus
                  value={firstName}
                  validators={["required", "isNonEmpty"]}
                  errorMessages={[
                    "This field is required",
                    "Enter your email, please",
                  ]}
                />
                <TextField
                  onChange={this.handleInputChange}
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="lastName"
                />
                <TextField
                  onChange={this.handleInputChange}
                  margin="normal"
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  autoComplete="city"
                />
                <DatePicker
                  onChange={(date) => {
                    let selectedDate = new Date(date);
                    if (!isNaN(selectedDate.getTime())) {
                      const adjustedDate = new Date(
                        selectedDate.getTime() -
                          selectedDate.getTimezoneOffset() * 60000
                      );
                      this.setState({ birthDate: adjustedDate });
                    }
                  }}
                  margin="normal"
                  fullWidth
                  format="YYYY/MM/DD"
                  id="birthDate"
                  label="Birth Date *"
                  name="birthDate"
                  autoComplete="birthDate"
                  sx={{ mt: 2, mb: 2 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={() => { this.handleContinue()}}
                >
                  Finish
                </Button>
              </ValidatorForm>
            </Box>
          </Box>
          <Box mt={8}></Box>
        </Container>
      </ThemeProvider>
    );
  }
}
