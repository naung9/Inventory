import React from "react";
import { View, StyleSheet, Image, Picker, ScrollView } from "react-native";
import {
  Text,
  Button,
  TouchableRipple,
  ActivityIndicator
} from "react-native-paper";
import { OutlinedTextField } from "react-native-material-textfield";
import ImagePicker from "react-native-image-picker";

const storagePath = "items/";

export default class ItemDetail extends React.Component {
  itemName = React.createRef();
  itemType = React.createRef();
  imageUrl = React.createRef();
  status = React.createRef();
  quantity = React.createRef();
  previousOwners = React.createRef();
  currentOwner = React.createRef();
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.add = this.add.bind(this);
    this.prepareToSave = this.prepareToSave.bind(this);
    try {
      this.item = props.route.params.item;
    } catch (error) {
      console.log(error);
      this.item = null;
    }
    this.storageService = props.storageService;
    this.fileStore = props.fileStore;
    this.pickImage = this.pickImage.bind(this);
    this.onSelectItemChange = this.onSelectItemChange.bind(this);
    this.checkNewItem = this.checkNewItem.bind(this);
    this.state = {
      imageUrl: "",
      item: this.item,
      updated: false,
      loading: false,
      pickedValue: "good"
    };
  }

  componentDidMount(): void {
    if (this.item !== null) {
      this.imageStoreRef = this.fileStore.ref(
        storagePath + this.item.imageName
      );

      this.imageStoreRef.getDownloadURL().then(
        value => {
          this.setState({
            imageUrl: value,
            imageName: this.item.imageName,
            updated: false,
            loading: false,
            pickedValue: this.item.status
          });
        },
        error => {
          console.log(error);
          this.state.loading = false;
          this.state.pickedValue = this.item.status;
          this.setState(this.state);
        }
      );
    }
  }
  prepareToSave(item, callback = result => console.log(result)) {
    this.state.loading = true;
    item.name = this.itemName.current.value();
    item.type = this.itemType.current.value();
    item.status = this.state.pickedValue;
    item.currentOwner = this.props.user.storeUser;
    item.quantity = parseInt(this.quantity.current.value(), 10);
    item.imageName = this.state.imageName;
    this.state.item = item;
    this.setState(this.state);
    if (this.state.updated) {
      this.fileStore
        .ref(storagePath + this.state.imageName)
        .putFile(this.state.imageUrl, {
          cacheControl: "no-store"
        })
        .then(() => callback(item))
        .catch(error => {
          this.state.loading = false;
          this.setState(this.state);
          console.error(error);
        });
    } else {
      callback(item);
    }
    return item;
  }

  pickImage() {
    ImagePicker.showImagePicker(
      { title: "Select Image", quality: 0.6 },
      response => {
        if (response.didCancel) {
          console.log("Cancelled");
        } else if (response.error) {
          alert("An Error Occured : ", response.error);
        } else {
          console.log(response.uri);
          this.setState({
            imageUrl: response.uri,
            imageName: response.fileName,
            updated: true
          });
        }
      }
    );
  }

  update() {
    this.prepareToSave(this.item, item => {
      this.storageService.saveItem("items", item).then(
        value => {
          if (value) {
            console.log("Success", value);
          }
          this.state.updated = false;
          this.state.loading = false;
          this.setState(this.state);
        },
        error => {
          console.log(error);
          this.state.loading = false;
          this.setState(this.state);
        }
      );
    });
  }
  delete() {
    this.storageService
      .deleteItem("items", this.item.id)
      .then(value => console.log(value), error => console.log(error));
  }
  add() {
    this.prepareToSave({}, item => {
      this.storageService.addItem("items", item).then(
        value => {
          value.get().then(
            snapshot => {
              this.state.item = snapshot.data();
              this.state.item.id = snapshot.id;
              console.log("ADDED Item", this.state.item);
              this.state.loading = false;
              this.state.updated = false;
              this.setState(this.state);
            },
            error => {
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
    });
  }

  checkNewItem() {
    return (
      this.state.item === null ||
      (Object.keys(this.state.item).length === 0 &&
        this.state.item.constructor === Object)
    );
  }

  onSelectItemChange(value, ref, another) {
    this.state.pickedValue = value;
    this.setState(this.state);
  }

  render() {
    let scrollItems = [];
    if (this.item !== null && this.item.previousOwners !== undefined) {
      for (let owner of this.item.previousOwners) {
        scrollItems.push(<Text>{owner.email}</Text>);
      }
    }
    let currentOwner;
    if (this.item !== null && this.item.currentOwner !== undefined) {
      currentOwner = (
        <Text>{"Current Owner : " + this.item.currentOwner.name}</Text>
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
          <TouchableRipple onPress={this.pickImage}>
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
          </TouchableRipple>
          <OutlinedTextField
            label="Item Name"
            value={this.checkNewItem() ? "" : this.state.item.name}
            placeholder="Item Name"
            ref={this.itemName}
            returnKeyType={"next"}
          />
          <OutlinedTextField
            label="Item Type"
            value={this.checkNewItem() ? "" : this.state.item.type}
            placeholder="Item Type"
            ref={this.itemType}
            returnKeyType={"next"}
          />
          <OutlinedTextField
            label="Quantity"
            value={this.checkNewItem() ? "" : this.state.item.quantity + ""}
            placeholder="Quantity"
            keyboardType={"number-pad"}
            ref={this.quantity}
            returnKeyType={"next"}
          />
          <Picker
            selectedValue={this.state.pickedValue}
            ref={this.status}
            onValueChange={this.onSelectItemChange}
          >
            <Picker.Item label={"Good Condition"} value={"good"} />
            <Picker.Item label={"Damaged"} value={"damaged"} />
            <Picker.Item label={"Lost"} value={"lost"} />
          </Picker>
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              icon={"check"}
              onPress={this.checkNewItem() ? this.add : this.update}
            >
              {this.checkNewItem() ? "Add" : "Save"}
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
