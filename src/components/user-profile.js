import React from "react";
import { Card, Title, Button, ActivityIndicator } from "react-native-paper";
import { OutlinedTextField } from "react-native-material-textfield";
import { View } from "react-native";
export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.user.storeUser.name,
      phone: props.user.storeUser.phoneNo,
      loading: false
    };
    this.user = this.props.user.storeUser;
    this.updateProfile = this.updateProfile.bind(this);
  }
  updateProfile() {
    this.state.loading = true;
    this.setState(this.state);
    this.user.name = this.state.name;
    this.user.phoneNo = this.state.phone;
    this.props.storageService.saveItem("users", this.user).then(
      () => {
        this.props.storageService
          .getCollection("items")
          .where("currentOwner.email", "==", this.user.email)
          .get()
          .then(
            snapshot => {
              snapshot.forEach(doc => {
                let item = doc.data();
                item.currentOwner = this.user;
                this.props.storageService
                  .saveItem("items", item)
                  .then(
                    () => console.log("Saved"),
                    error => console.log(error)
                  );
              });
              this.state.loading = false;
              this.setState(this.state);
            },
            error => {
              console.log(error);
              this.state.loading = false;
              this.setState(this.state);
            }
          );
      },
      error => {
        console.log(error);
        this.state.loading = false;
        this.setState(this.state);
      }
    );
  }
  render() {
    if (this.state.loading)
      return (
        <View style={container}>
          <ActivityIndicator />
        </View>
      );
    return (
      <Card style={cardStyle}>
        <Card.Content>
          <Title>{this.props.user.storeUser.email}</Title>
          <OutlinedTextField
            label="Name"
            value={this.state.name}
            placeholder="Name"
            onChangeText={value =>
              this.setState({
                name: value,
                phone: this.state.phone,
                loading: this.state.loading
              })
            }
            returnKeyType={"next"}
          />
          <OutlinedTextField
            label="Phone Number"
            value={this.state.phone}
            onChangeText={value =>
              this.setState({
                name: this.state.name,
                phone: value,
                loading: this.state.loading
              })
            }
            keyboardType={"phone-pad"}
            placeholder="Phone Number"
            returnKeyType={"next"}
          />
        </Card.Content>
        <Card.Actions>
          <View style={container}>
            <Button
              mode={"contained"}
              icon={"floppy"}
              compact={true}
              onPress={this.updateProfile}
            >
              Update
            </Button>
            <Button
              mode={"contained"}
              icon={"cancel"}
              onPress={this.props.navigation.goBack}
            >
              Cancel
            </Button>
          </View>
        </Card.Actions>
      </Card>
    );
  }
}

const cardStyle = {
  margin: 10
};
const container = {
  justifyContent: "space-around",
  flexDirection: "row",
  flex: 1
};
