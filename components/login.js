import React from "react";
import {
  View,
  Text,
  CheckBox,
  StyleSheet,
  Platform,
  Button,
  ActivityIndicator
} from "react-native";
import { OutlinedTextField } from "react-native-material-textfield";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.passwordRef = React.createRef();
    this.emailRef = React.createRef();
    this.doLogin = this.doLogin.bind(this);
    this.state = {
      loading: false
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
          this.setState({ loading: false });
        }
      );
    // this.setState({ loading: false });
  }
  render() {
    let body = (
      <View>
        <OutlinedTextField
          label="Email"
          placeholder="Email"
          keyboardType={"email-address"}
          ref={this.emailRef}
          returnKeyType={"next"}
        />
        <OutlinedTextField
          label="Password"
          placeholder="Password"
          ref={this.passwordRef}
          secureTextEntry={true}
        />
        <Button title={"Login"} onPress={this.doLogin} text={"LOGIN"} />
      </View>
    );
    if (this.state.loading) {
      body = <ActivityIndicator />;
    }
    return <View style={styles.container}>{body}</View>;
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
