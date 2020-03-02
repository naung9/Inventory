import React from "react";
import { Appbar, Menu } from "react-native-paper";

export default class MyHeader extends React.Component {
  constructor(props) {
    super(props);
    this.previous = props.previous;
    this.scene = props.scene;
    this.navigation = props.navigation;
    this.auth = props.auth;
    this.user = props.user.storeUser;
    this.showMenu = this.showMenu.bind(this);
    this.onMenuDismiss = this.onMenuDismiss.bind(this);
    this.logOut = this.logOut.bind(this);
    this.state = { showMenu: false };
  }

  logOut() {
    this.auth
      .signOut()
      .then(() => console.log("Signed Out"), error => console.error(error));
  }
  showMenu() {
    this.setState({ showMenu: true });
  }
  onMenuDismiss() {
    this.setState({ showMenu: false });
  }
  render() {
    return (
      <Appbar.Header>
        {this.previous ? (
          <Appbar.BackAction onPress={this.navigation.goBack} />
        ) : (
          <></>
        )}
        <Appbar.Content title={"Inventory List"} />
        <Menu
          onDismiss={this.onMenuDismiss}
          visible={this.state.showMenu}
          anchor={
            <Appbar.Action
              icon={"menu"}
              color={"white"}
              onPress={this.showMenu}
            />
          }
        >
          <Menu.Item
            icon="check"
            title={"My Profile"}
            onPress={() => {
              this.onMenuDismiss();
              this.navigation.navigate("UserProfile");
            }}
          />
          <Menu.Item icon="logout" title="Log Out" onPress={this.logOut} />
        </Menu>
      </Appbar.Header>
    );
  }
}
