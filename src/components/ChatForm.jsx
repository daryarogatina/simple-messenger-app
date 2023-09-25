import * as React from "react";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ListItemButton from "@mui/material/ListItemButton";
import { Component } from "react";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Fab from "@mui/material/Fab";
import SendIcon from "@mui/icons-material/Send";
import DensityMediumIcon from "@mui/icons-material/DensityMedium";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import LogoutIcon from "@mui/icons-material/Logout";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from '@mui/icons-material/Search';
const theme = createTheme();

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default class ChatForm extends Component {
  state = {
    left: false,
    messages: [],
    message: "",
    firstName: "",
    recipients: [],
    recipientId: 0,
    senderId: 0,
    name: "",
    showStack: false,
    openModal: false,
    offsetCount: 0
  };

  handleOpenModal = (event) => {
    // event.preventDefault()
    this.setState({ openModal: true });
  };

  handleCloseModal = () => {
    this.setState({ openModal: false });
  };

  toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    this.setState({ left: open });
  };

  handleStackClose = () => {
    this.setState({ showStack: false });
  };

  // Поиск пользователей в базе данных
  searchUser = () => {
    const { firstName } = this.state;
    console.log(firstName);

    axios
      .get(`http://localhost:4000/search?firstName=${firstName}`)
      .then((response) => {
        if (!response.data) {
          this.setState({ showStack: true });
          return;
        }
        this.setState({
          recipients: response.data, // массив найденных пользователей
        });
        console.info("response.data: ", response.data);
        // console.log(response.data[0].id);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleInputChange = (event) => {
    this.setState({ message: event.target.value });
  };
  handleInputChangeSearch = (event) => {
    this.setState({ firstName: event.target.value });
    // console.log(event.target.value)
  };

  // открывает всю переписку с найденным юзером, когда кликаешь на него
  // добавить сортировку по времени
  // последние 20 сообщений и значек загрузки дальше
  // добавлять айдишник получателя в стейт
  // подтянуть вверх айди получателя

  handleOpenMessagesClick = (recipient) => {
    const senderId = localStorage.getItem("userId");
    const recipientId = recipient.id;
    const recipientName = recipient.firstName;
    let count = this.state.offsetCount;
    // console.log(
    //   "handleListItemClick takes senderId : ",
    //   senderId,
    //   "recipientId :",
    //   recipientId,
    //   "offsetCount :",
    //   this.state.offsetCount
    // );
    axios
      .get(
        `http://localhost:4000/messages?count=${count}&senderId=${senderId}&recipientId=${recipientId}`
      )
      .then((response) => {
        console.info(response);
        console.info(response.data);
        count += 10; 

        this.setState({
          messages: response.data,
          senderId: senderId,
          recipientId: recipientId,
          name: recipientName,
          offsetCount: count
        }); 
        // console.info("response.data: ", response.data[0].sender_id);
        console.log ("Previous messages: ", response.data)
      })
      .catch((error) => {
        console.error(error);
      });
  };



// подгружает сообщения

handleDownloadMessages = () => {
  let count = this.state.offsetCount;
  let senderId = localStorage.getItem("userId");
  let recipientId = this.state.recipientId;
  console.log("Messages: ", this.state.messages)

  axios
  .get(
    `http://localhost:4000/messages?count=${count}&senderId=${senderId}&recipientId=${recipientId}`
  )
  .then((response) => {

    if (response.data.length < 10) {
      count += response.data.length;
    } else {
      count += 10;
    }

    const newArray = [...response.data, ...this.state.messages];
    console.log("NewArray: ", newArray)

     this.setState({
       messages:  newArray
     }); 

    console.log ("Previous messages: ", response.data)
  })
  .catch((error) => {
    console.error(error);
  });
}



  // отправляет сообщение
  handleSendMessage = () => {
    // как достать айдишник получателя?
    // добавила в стейт
    console.info(
      "Chek state of sender: ",
      this.state.senderId,
      "Chek state of recipient: ",
      this.state.recipientId
    );
    axios
      .post(`http://localhost:4000/send`, {
        sender_id: +this.state.senderId,
        recipient_id: +this.state.recipientId,
        message_text: this.state.message,
      })
      .then((response) => {
        console.log(response.data);

        const newMessage = {
          message_id: response.data.message_id,
          sender_id: response.data.sender_id,
          recipient_id: response.data.recipient_id,
          message_text: response.data.message_text,
        };

        // response.data;

        this.setState((prevState) => ({
          messages: [...prevState.messages, newMessage],
          message: "",
        }));
        console.log(
          "Last message: ",
          newMessage,
          "senderId :",
          response.data.sender_id
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleExit = () => {
    window.location.href = "/";
    localStorage.removeItem("userId");
  };

  render() {
    const list = (
      <Grid
        sx={{ width: 280, marginTop: 1 }}
        role="presentation"
        onClick={this.toggleDrawer(false)}
        onKeyDown={this.toggleDrawer(false)}
      >
        <List>
          <Avatar sx={{ marginLeft: 3, right: 10 }} />
          <ListItem disablePadding>
            <ListItemButton key="Profile" onClick={this.handleOpenModal}>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
          {["Friends", "New message"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem
            key="logout"
            disablePadding
            sx={{ marginLeft: 3, right: 10 }}
            onClick={() => {
              this.handleExit();
            }}
          >
            <LogoutIcon></LogoutIcon>
            <ListItemButton>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Grid>
    );

    const { left, firstName } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <DensityMediumIcon
          onClick={this.toggleDrawer(true)}
          sx={{ width: 50, mt: 2 }}
        ></DensityMediumIcon>
        <Drawer anchor="left" open={left} onClose={this.toggleDrawer(false)}>
          {list}
        </Drawer>
        <Modal
          open={this.state.openModal}
          onClose={this.handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Here is the modal window for the profile information.
            </Typography>
          </Box>
        </Modal>
        <Grid container>
          <Grid item xs={12}></Grid>
        </Grid>
        <Grid container component={Paper}>
          <Grid item xs={3} sx={{ borderRight: "1px solid #e0e0e0" }}>
            <List>
              {this.state.recipients.map((recipient) => (
                <ListItem key={recipient.id}>
                  <ListItemIcon>
                    <Avatar alt="" src="" />
                  </ListItemIcon>
                  <ListItemText primary={this.state.name}></ListItemText>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Grid container style={{ padding: "20px" }}>
              <Grid item xs={10} style={{ padding: "10px" }}>
                <TextField
                  id="Search"
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={firstName}
                  onChange={this.handleInputChangeSearch}
                />
              </Grid>
              <Grid
                item
                xs={1}
                align="right"
                style={{ paddingTop: "10px" }}
                onClick={this.searchUser}
              >
                <Fab color="primary" aria-label="add">
                  <SearchIcon
                  size='small'/>
                </Fab>
              </Grid>
            </Grid>




            <Divider />
            <List onClick={() => console.log(this.state.recipients)}>
              {this.state.recipients.map((recipient) => (
                <ListItemButton
                  key={recipient.id}
                  onClick={() => this.handleOpenMessagesClick(recipient)}
                >
                  <ListItemIcon>
                    <Avatar alt={recipient.firstName} src="" />
                  </ListItemIcon>
                  <ListItemText primary={recipient.firstName} />
                </ListItemButton>
              ))}
            </List>
          </Grid>
          <Grid item xs={9}>
            <List sx={{ height: "70vh", overflowY: "auto" }}>
            <Grid align='center'>
                <Fab color="primary" aria-label="add">
              <DownloadIcon
              onClick={this.handleDownloadMessages}></DownloadIcon>
                </Fab>
              </Grid>
              {this.state.messages.map((message) => (
                <ListItem key={message.message_id}>
                  <Grid container>
                    <Grid item xs={12}>
                      <ListItemText
                        onClick={() =>
                          console.log(
                            message.sender_id,
                            "State",
                            +this.state.senderId
                          )
                        }
                        align={
                          message.sender_id === +this.state.senderId
                            ? "right"
                            : "left"
                        }
                        primary={message.message_text}
                      ></ListItemText>
                    </Grid>
                    <Grid item xs={12}>
                      {/* <ListItemText
                        align={message.sender_id === this.state.senderId ? "right" : "left"}
                        // secondary={message.time}
                      ></ListItemText> */}
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
            <Divider />
            <Grid container style={{ padding: "20px" }}>
              <Grid item xs={11}>
                <TextField
                  onChange={this.handleInputChange}
                  value={this.state.message}
                  id="message"
                  label="Type Something"
                  fullWidth
                />
              </Grid>
              <Grid item xs={1} align="right">
                <Fab color="primary" aria-label="add">
                  <SendIcon onClick={this.handleSendMessage} />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Snackbar
            open={this.state.showStack}
            autoHideDuration={6000}
            onClose={this.handleStackClose}
          >
            <MuiAlert
              onClose={this.handleStackClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              User not found.
            </MuiAlert>
          </Snackbar>
        </Stack>
      </ThemeProvider>
    );
  }
}
