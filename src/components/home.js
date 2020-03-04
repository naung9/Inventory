import React from "react";
import Items from "./items";
import ItemDetail from "./item-detail";
import ItemDetailAction from "./item-detail-action";
import UserProfile from "./user-profile";
import MyHeader from "./header";
import { createStackNavigator } from "@react-navigation/stack";
import ToDo from "./to-do";

const Stack = createStackNavigator();
export class Home extends React.Component {
  constructor(props) {
    super(props);
    // this.messaging = this.props.messaging;
    // this.registerListeners = this.registerListeners.bind(this);
    // this.requestPermission = this.requestPermission.bind(this);
  }

  componentDidMount(): void {
    // this.requestPermission().then(
    //   () => console.log("Register Success"),
    //   error => console.error("Error Registering On Message", error)
    // );
  }

  // async requestPermission() {
  //   let permission = false;
  //   while (!permission) {
  //     console.log("Requesting Permission");
  //     permission = await this.messaging.requestPermission();
  //     console.log("Permission", permission);
  //   }
  //   this.registerListeners();
  //   try {
  //     await this.messaging.sendMessage({
  //       data: { message: "HAHAHA" },
  //       to:
  //         "fJrIWp2GW7c:APA91bEmk_Vz2suq57wpErzD6-UVMUi48xhbYlf6byyZPkK40hr-D-lYNYFjACWZcSsw5ZhH3GqewDnMnlKcy0WKF8ZXtJ29s6KCmB-pvGJr-TFflZSxGP79JHbkWZp8fzc-9TtsDQrL"
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // registerListeners() {
  //   this.unSubscribeMsg = this.messaging.onMessage(async message =>
  //     console.log("Foreground Message", message.data)
  //   );
  //   this.unSubscribeSent = this.messaging.onMessageSent(messageId =>
  //     console.log("Message has been sent to the FCM server", messageId)
  //   );
  //   this.unSubscribeError = this.messaging.onSendError(error =>
  //     console.error("An error occurred when sending a message to FCM", error)
  //   );
  // }

  componentWillUnmount(): void {
    // this.unSubscribeMsg();
    // this.unSubscribeSent();
    // this.unSubscribeError();
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
        <Stack.Screen name={"Item Detail"}>
          {props => <ItemDetail {...props} {...this.props} />}
        </Stack.Screen>
        <Stack.Screen name={"Item Detail Action"}>
          {props => <ItemDetailAction {...props} {...this.props} />}
        </Stack.Screen>
        <Stack.Screen name={"Profile"}>
          {props => <UserProfile {...props} {...this.props} />}
        </Stack.Screen>
        <Stack.Screen name={"To Do"}>
          {props => <ToDo {...props} {...this.props} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }
}
