import React from "react";
import { StyleSheet, View, Image, Linking } from "react-native";
import {
  Card,
  TouchableRipple,
  Divider,
  Text,
  Button,
  Paragraph,
  Title,
  Menu
} from "react-native-paper";

export default class ItemListItem extends React.Component {
  constructor(props) {
    super(props);
    this.fileStore = props.fileStore;
    this.state = { imageUrl: "", menuVisible: false };
    this.hideMenu = this.hideMenu.bind(this);
  }

  componentDidMount(): void {
    this.fileStore
      .ref("items/" + this.props.item.imageName)
      .getDownloadURL()
      .then(url =>
        this.setState({ imageUrl: url, menuVisible: this.state.menuVisible })
      );
  }

  hideMenu() {
    this.setState({ imageUrl: this.state.imageUrl, menuVisible: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <Card>
          <Card.Title
            title={this.props.item.name}
            subtitle={"Type : " + this.props.item.type}
            left={props => <Text>{"Qty : " + this.props.item.quantity}</Text>}
            right={props => (
              <Image
                source={
                  this.state.imageUrl === ""
                    ? null
                    : { uri: this.state.imageUrl }
                }
                style={styles.imageStyle}
              />
            )}
          />
          <Card.Actions styles={styles.cardFooter}>
            <Menu
              visible={this.state.menuVisible}
              onDismiss={this.hideMenu}
              anchor={
                <Button
                  onPress={() =>
                    this.setState({
                      imageUrl: this.state.imageUrl,
                      menuVisible: true
                    })
                  }
                >
                  Contact Owner
                </Button>
              }
            >
              <Menu.Item
                title={"Send Email"}
                onPress={() => {
                  this.hideMenu();
                  Linking.openURL(
                    "mailto:" + this.props.item.currentOwner.email
                  );
                }}
              />
              <Menu.Item
                title={"Call Phone"}
                onPress={() => {
                  this.hideMenu();
                  Linking.openURL(
                    `tel:${this.props.item.currentOwner.phoneNo}`
                  );
                }}
              />
              <Menu.Item
                title={"Send SMS"}
                onPress={() => {
                  this.hideMenu();
                  Linking.openURL(
                    "sms:" + this.props.item.currentOwner.phoneNo
                  );
                }}
              />
            </Menu>

            <View style={styles.verticalDivider} />
            <Button
              onPress={() => {
                console.log(this.props.item);
                this.props.navigation.navigate("ItemDetail", {
                  item: this.props.item
                  // storageService: this.props.storageService
                });
              }}
            >
              Details
            </Button>
          </Card.Actions>
        </Card>
        <Divider />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 2
  },
  verticalDivider: {
    height: 25,
    borderWidth: 0.5,
    backgroundColor: "grey"
  },
  imageStyle: {
    width: 70,
    height: 70
  },
  cardFooter: {
    justifyContent: "space-around"
  }
});
