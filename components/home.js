import React from "react";
import Items from "./items";
import ItemDetail from "./item-detail";
import ItemDetailAction from "./item-detail-action";
import UserProfile from "./user-profile";
import MyHeader from "./header";
import firebase from "@react-native-firebase/app";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();
export class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(): void {
    this.props.messaging
      .requestPermission()
      .then(result => console.log("Request Permission :", result));
    // this.createNotificationListeners().then(
    //   result => console.log(result),
    //   error => console.log(error)
    // );
  }

  componentWillUnmount(): void {}

  async createNotificationListeners() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body } = notification;
        console.log(title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;
        console.log(title, body);
      });
  }

  render() {
    return (
      <Stack.Navigator
        initialRouteName={"Items"}
        headerMode={"screen"}
        screenOptions={{
          header: ({ scene, previous, navigation }) => (
            <MyHeader
              scene={scene}
              previous={previous}
              navigation={navigation}
              auth={this.props.auth}
              user={this.props.user}
            />
          )
        }}
      >
        <Stack.Screen name={"Items"}>
          {props => <Items {...props} {...this.props} />}
        </Stack.Screen>
        <Stack.Screen name={"ItemDetail"}>
          {props => <ItemDetail {...props} {...this.props} />}
        </Stack.Screen>
        <Stack.Screen name={"ItemDetailAction"}>
          {props => <ItemDetailAction {...props} {...this.props} />}
        </Stack.Screen>
        <Stack.Screen name={"UserProfile"}>
          {props => <UserProfile {...props} {...this.props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
}
