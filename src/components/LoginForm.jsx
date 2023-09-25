// Здесь будет определяться пользовательский интерфейс для формы входа в мессенджер (поля, кнопки),
// который получает от пользователя реквизиты для данных формы, ошибок и обработчиков событий
// файл затем импортируется в LoginFormContainer.js
import * as React  from 'react';
import { Component } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import axios from 'axios';

const theme = createTheme();


export default class LoginForm extends Component {

    state = {
      email: "",
      password: "",
    };

  handleSubmit = (event) => {
    event.preventDefault();

  }
  
  componentDidMount() {
    
    ValidatorForm.addValidationRule("notEmpty", (value) => {
      // console.log(value)
      return (value).length > 0;
    });
  }


  // тут нужно дописать проверку для пароля!!! 
  checkUser = () => {
    const { email, password } = this.state;
    if (email.length && password.length) {
    axios.get(`http://localhost:4000/login?email=${email}&password=${password}`)
      .then((response) => {
        console.log(response);
        if (response.data) localStorage.setItem('userId',response.data[0].id);
        this.setState({
          email: response.data,
          password: response.data,
        });
    if (response.data[0].id) window.location.href = "/chat"
      })
      .catch((error) => {
        console.error(error);
      });
    } 
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // handleLogin = () => {
  //   this.checkUser();
  //   window.location.href = "/chat"
  // };

  handleLogin = () => {
    this.checkUser();
  };

  render() {
    const { email, password } = this.state;
   
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
              Sign in
            </Typography>
            <Box
              onSubmit={this.handleSubmit}
              noValidate
              sx={{ mt: 1, width: 400}}
            >
              <ValidatorForm onSubmit={this.handleSubmit}> 
              <TextValidator
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={this.handleInputChange}
                validators={["notEmpty", "isEmail"]}
                errorMessages={['Incorrect email', 'Email is not valid']}
              />
              <TextValidator
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={this.handleInputChange}
                validators={["notEmpty"]}
                errorMessages={['Incorrect password']}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={this.handleLogin}
              >
                Sign in
              </Button>
              </ValidatorForm>
              <Grid container>
                <Grid item>
                  <Link href="/signUp" variant="body2">
                    {"Don't have an account? Sign Up"}
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

