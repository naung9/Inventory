import React from "react";
import { View, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import { OutlinedTextField } from "react-native-material-textfield";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.passwordRef = React.createRef();
    this.emailRef = React.createRef();
    this.doLogin = this.doLogin.bind(this);
    this.state = {
      loading: false,
      error: ""
    };
  }

  componentDidMount(): void {
    this.emailRef.current.focus();
  }

  doLogin(): void {
    this.setState({ loading: true });
    this.props.auth
      .signInWithEmailAndPassword(
        this.emailRef.current.value(),
        this.passwordRef.current.value()
      )
      .then(
        user => console.log("Login Success ", user),
        error => {
          console.log(error);
          this.setState({
            loading: false,
            error:
              "The password is invalid or the user does not have a password."
          });
        }
      );
    // this.setState({ loading: false });
  }
  render() {
    let body = (
      <View style={styles.loginForm}>
        <OutlinedTextField
          label="Email"
          placeholder="Email"
          keyboardType={"email-address"}
          autoCapitalize="none"
          ref={this.emailRef}
          returnKeyType={"next"}
        />
        <OutlinedTextField
          label="Password"
          placeholder="Password"
          ref={this.passwordRef}
          secureTextEntry={true}
        />
        <Button mode={"contained"} onPress={this.doLogin}>
          Login
        </Button>
        <Button onPress={() => this.props.navigation.navigate("Register")}>
          Register
        </Button>
      </View>
    );
    if (this.state.loading) {
      body = <ActivityIndicator />;
    }
    return (
      <>
        <View style={styles.container}>{body}</View>
        <Snackbar
          visible={!!this.state.error}
          duration={5000}
          action={{
            label: "Dismiss",
            onPress: () => {
              this.state.error = "";
              this.setState(this.state);
            }
          }}
          onDismiss={() => {
            this.state.error = "";
            this.setState(this.state);
          }}
        >
          {this.state.error}
        </Snackbar>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  loginForm: {
    margin: 15
  }
});
