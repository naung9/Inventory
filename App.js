/**
 * Sample React Native App with Firebase
 * https://github.com/invertase/react-native-firebase
 *
 * @format
 * @flow
 */
import "react-native-gesture-handler";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Platform } from "react-native";
import { Login } from "./src/components/login";
import auth from "@react-native-firebase/auth";
import { Home } from "./src/components/home";
import {
  Provider as PaperProvider,
  ActivityIndicator
} from "react-native-paper";
import { FireStoreService } from "./src/services/FireStoreService";
import { createStackNavigator } from "@react-navigation/stack";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { Register } from "./src/components/register";
import messaging from "@react-native-firebase/messaging";

// TODO(you): import any additional firebase services that you require for your app, e.g for auth:
//    1) install the npm package: `yarn add @react-native-firebase/auth@alpha` - you do not need to
//       run linking commands - this happens automatically at build time now
//    2) rebuild your app via `yarn run run:android` or `yarn run run:ios`
//    3) import the package here in your JavaScript code: `import '@react-native-firebase/auth';`
//    4) The Firebase Auth service is now available to use here: `firebase.auth().currentUser`

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\nCmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\nShake or press menu button for dev menu"
});

const firebaseCredentials = Platform.select({
  ios: "https://invertase.link/firebase-ios",
  android: "https://invertase.link/firebase-android"
});

type Props = {};
const Stack = createStackNavigator();

export default class App extends Component<Props> {
  menuRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: false
    };
    this.auth = auth();
    this.fireStore = firestore();
    this.storageService = new FireStoreService(this.fireStore);
    this.fileStore = storage();
    this.messaging = messaging();
  }
  componentDidMount(): void {
    // *************     Notification And Cloud Messaging Modules to be Integrated Later On    ***********
    this.messaging
      .registerForRemoteNotifications()
      .then(token => console.log(token), error => console.error(error));
    console.log("App Started");
    this.authUnSubscriber = this.auth.onAuthStateChanged(async user => {
      console.log("Auth State Changed", user);
      this.state.loading = true;
      this.setState(this.state);
      if (user !== null) {
        try {
          let snapshot = await this.storageService
            .getCollection("users")
            .where("email", "==", user.email)
            .get();
          let usr = snapshot.docs.length > 0 ? snapshot.docs[0].data() : null;
          if (usr !== null) {
            usr.id = snapshot.docs[0].id;
            const token = await this.messaging.getToken();
            console.log("Token", token);
            if (usr.token === undefined || usr.token !== token) {
              usr.token = token;
              await this.storageService.saveItem("users", usr);
            }
            console.log(usr);
            this.setState({
              user: { authUser: user, storeUser: usr },
              loading: false
            });
          } else {
            console.error("Unexpected Error");
            this.state.loading = false;
            this.setState(this.state);
          }
        } catch (error) {
          console.error(error);
          this.setState({ user: null, loading: false });
        }
      } else {
        this.setState({ user: null, loading: false });
      }
    });
  }

  componentWillUnmount(): void {
    console.log("UnMounting Component");
    this.authUnSubscriber();
  }

  render() {
    if (this.state.loading) return <ActivityIndicator />;
    return (
      <PaperProvider>
        <NavigationContainer>
          {this.state.user ? (
            <Home
              auth={this.auth}
              storageService={this.storageService}
              fileStore={this.fileStore}
              user={this.state.user}
              messaging={this.messaging}
            />
          ) : (
            <Stack.Navigator
              initialRouteName={"Login"}
              screenOptions={{
                headerShown: false
              }}
            >
              <Stack.Screen name={"Login"}>
                {props => <Login {...props} auth={this.auth} />}
              </Stack.Screen>
              <Stack.Screen name={"Register"}>
                {props => (
                  <Register
                    {...props}
                    storageService={this.storageService}
                    fileStore={this.fileStore}
                    auth={this.auth}
                  />
                )}
              </Stack.Screen>
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    );
  }
}
