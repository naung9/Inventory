import React from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { OutlinedTextField } from "react-native-material-textfield";

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.storageService = props.storageService;
    this.auth = this.props.auth;
    this.register = this.register.bind(this);
    this.onObjectChange = this.onObjectChange.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
    this.state = {
      registerUser: {
        name: "",
        phoneNo: "",
        email: ""
      },
      password: "",
      confirmPassword: "",
      accessKey: "",
      rejected: "",
      loading: false
    };
  }

  register() {
    this.state.loading = true;
    this.setState(this.state);
    if (
      !this.state.password ||
      this.state.confirmPassword !== this.state.password
    ) {
      this.state.rejected = "Password and Confirm Password does not match";
      this.state.loading = false;
      this.setState(this.state);
      return;
    }
    if (this.state.accessKey === null || this.state.accessKey === "") {
      this.state.rejected =
        "Access key is required to create account. Ask one from your superiors.";
      this.state.loading = false;
      this.setState(this.state);
      return;
    }
    this.storageService
      .getCollection("accesskeys")
      .where("key", "==", this.state.accessKey)
      .get()
      .then(
        snapshot => {
          let key = snapshot.docs.length > 0 ? snapshot.docs[0].data() : null;
          if (key !== null) {
            console.log(key);
            this.auth
              .createUserWithEmailAndPassword(
                this.state.registerUser.email,
                this.state.password
              )
              .then(
                user => {
                  console.log("Created User :", user);
                  let saveUser = this.state.registerUser;
                  saveUser.organization = key.organization;
                  this.storageService.addItem("users", saveUser).then(
                    () => {
                      this.auth
                        .signInWithEmailAndPassword(
                          this.state.registerUser.email,
                          this.state.password
                        )
                        .then(
                          loggedInUser => {
                            console.log("Login Success ", loggedInUser);
                            // this.state.loading = false;
                            // this.setState(this.state);
                          },
                          error => {
                            console.log(error);
                            this.state.rejected = error;
                            this.state.loading = false;
                            this.setState(this.state);
                            this.props.navigation.navigate("Login");
                          }
                        );
                    },
                    error => {
                      console.log(error);
                      this.state.rejected = error;
                      this.state.loading = false;
                      this.setState(this.state);
                    }
                  );
                },
                error => {
                  console.log(error);
                  this.state.rejected = error;
                  this.state.loading = false;
                  this.setState(this.state);
                }
              );
          } else {
            console.log("Unexpected read error");
            this.state.rejected = "Error accessing to server please try again.";
            this.state.loading = false;
            this.setState(this.state);
          }
        },
        error => {
          console.log(error);
          this.state.rejected =
            "Access key is not valid. Ask one from your superiors.";
          this.state.loading = false;
          this.setState(this.state);
        }
      );
  }

  onObjectChange(property, value) {
    this.state.registerUser[property] =
      property === "email" ? value.toLowerCase() : value;
    this.setState(this.state);
  }
  onTextChange(property, value) {
    this.state[property] = value;
    this.setState(this.state);
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <OutlinedTextField
              label="Name"
              value={this.state.registerUser.name}
              placeholder="Name"
              onChangeText={value => this.onObjectChange("name", value)}
              returnKeyType={"next"}
            />
            <OutlinedTextField
              label="Email"
              placeholder="Email"
              autoCapitalize="none"
              value={this.state.registerUser.email}
              keyboardType={"email-address"}
              onChangeText={value => this.onObjectChange("email", value)}
              returnKeyType={"next"}
            />
            <OutlinedTextField
              label="Phone No"
              placeholder="Phone No"
              value={this.state.registerUser.phoneNo}
              keyboardType={"phone-pad"}
              onChangeText={value => this.onObjectChange("phoneNo", value)}
              returnKeyType={"next"}
            />
            <OutlinedTextField
              label="Access Key"
              placeholder="Access Key"
              autoCapitalize="none"
              value={this.state.accessKey}
              onChangeText={value => this.onTextChange("accessKey", value)}
              returnKeyType={"next"}
            />
            <OutlinedTextField
              label="Password"
              value={this.state.password}
              placeholder="Password"
              onChangeText={value => this.onTextChange("password", value)}
              secureTextEntry={true}
            />
            <OutlinedTextField
              label="Confirm Password"
              value={this.state.confirmPassword}
              placeholder="Confirm Password"
              onChangeText={value =>
                this.onTextChange("confirmPassword", value)
              }
              secureTextEntry={true}
            />
            <Button mode={"contained"} onPress={this.register}>
              Register
            </Button>
            <Button onPress={this.props.navigation.goBack}>
              Already Registered? Log In
            </Button>
            <Snackbar
              visible={!!this.state.rejected}
              duration={5000}
              onDismiss={() => {
                this.state.rejected = "";
                this.setState(this.state);
              }}
            >
              {this.state.rejected}
            </Snackbar>
          </>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 15,
    marginTop: Platform.select({ ios: 8, android: 32 }),
    // alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});
