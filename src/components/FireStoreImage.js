import React from "react";
import { Image, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default class FireStoreImage extends React.Component {
  constructor(props) {
    super(props);
    this.imageName = props.imageName;
    this.state = {
      imageUrl: ""
    };
    this.fileStore = props.fileStore;
  }

  componentDidMount(): void {
    this.fileStore
      .ref("items/" + this.imageName)
      .getDownloadURL()
      .then(
        value => {
          this.state.imageUrl = value;
          this.setState(this.state);
        },
        error => {
          console.log(error);
        }
      );
  }

  render() {
    if (this.state.imageUrl)
      return (
        <Image source={{ uri: this.state.imageUrl }} style={this.props.style} />
      );
    else
      return (
        <View style={{ justifyContent: "center", ...this.props.style }}>
          <ActivityIndicator />
        </View>
      );
  }
}
