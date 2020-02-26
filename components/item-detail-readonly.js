import React from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableRipple
} from "react-native-paper";
import { Image, Picker, ScrollView, StyleSheet, View } from "react-native";
import { OutlinedTextField } from "react-native-material-textfield";

export default class ItemDetailReadOnly extends React.Component {
  render() {
    let scrollItems = [];
    if (this.item.previousOwners !== undefined) {
      for (let owner of this.item.previousOwners) {
        scrollItems.push(<Text>{owner.email}</Text>);
      }
    }
    let currentOwner;
    if (this.item.currentOwner !== undefined) {
      currentOwner = (
        <Text>{"Current Owner : " + this.item.currentOwner.email}</Text>
      );
    }
    if (this.state.loading)
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          {this.state.imageUrl === "" ? (
            <View style={styles.image}>
              <Text>Press To Select Image</Text>
            </View>
          ) : (
            <Image
              source={{ uri: this.state.imageUrl }}
              style={styles.image}
              loadingIndicatorSource={<ActivityIndicator />}
            />
          )}
          <OutlinedTextField
            label="Item Name"
            value={this.item.name}
            placeholder="Item Name"
            ref={this.itemName}
            editable={false}
          />
          <OutlinedTextField
            label="Item Type"
            value={this.item.type}
            placeholder="Item Type"
            ref={this.itemType}
            editable={false}
          />
          <OutlinedTextField
            label="Status"
            value={this.item.status}
            placeholder="Item Status"
            ref={this.itemType}
            editable={false}
          />
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              icon={"check"}
              onPress={this.update}
            >
              {"Request"}
            </Button>
            <Button
              mode="contained"
              icon={"cancel"}
              color={"red"}
              onPress={this.props.navigation.goBack}
            >
              {"Cancel"}
            </Button>
          </View>
        </View>
        <View style={styles.owners}>
          {currentOwner}
          <ScrollView>{scrollItems}</ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  owners: {
    flex: 1,
    justifyContent: "center",
    margin: 20
  },
  content: {
    margin: 10
  },
  buttonRow: {
    justifyContent: "space-around",
    flexDirection: "row"
  },
  image: {
    flexWrap: "wrap",
    height: 200,
    minWidth: 200,
    borderColor: "black",
    borderRadius: 2,
    borderWidth: 0.5,
    marginBottom: 10,
    justifyContent: "center"
  }
});
