import React from "react";
import {
  ActivityIndicator,
  Button,
  Snackbar,
  Text,
  TextInput
} from "react-native-paper";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { OutlinedTextField } from "react-native-material-textfield";

export default class ItemDetailAction extends React.Component {
  constructor(props) {
    super(props);
    this.item = props.route.params.item;
    this.statusMap = {
      good: "Available",
      rented: "Rented",
      pending: "Pending",
      damaged: "Damaged",
      lost: "Lost"
    };
    this.request = this.request.bind(this);
    this.validate = this.validate.bind(this);
    this.getRentableQty = this.getRentableQty.bind(this);
    this.storageService = props.storageService;
    this.fileStore = props.fileStore;
    this.disabledStatuses = ["rented", "lost"];
    this.user = props.user.storeUser;
    this.state = {
      loading: false,
      updated: false,
      imageUrl: "",
      amount: "1",
      status: this.item.status
    };
  }

  getRentableQty() {
    this.rentedQty = 0;
    let requestInfos =
      this.item.requestInfos === undefined ? [] : this.item.requestInfos;
    requestInfos.forEach(request => {
      this.rentedQty += request.quantity;
    });
    return this.item.quantity - this.rentedQty;
  }

  componentDidMount(): void {
    if (this.item !== null) {
      this.imageStoreRef = this.fileStore.ref("items/" + this.item.imageName);

      this.imageStoreRef.getDownloadURL().then(
        value => {
          this.setState({
            imageUrl: value,
            updated: this.state.updated,
            loading: false
          });
        },
        error => {
          console.log(error);
          this.state.loading = false;
          this.setState(this.state);
        }
      );
    }
  }

  request() {
    this.state.loading = true;
    this.setState(this.state);
    let requestInfos =
      this.item.requestInfos === undefined ? [] : this.item.requestInfos;
    requestInfos.push({
      status: "pending",
      requestBy: this.user,
      quantity: parseInt(this.state.amount, 10)
    });
    this.storageService
      .saveItem("items", {
        id: this.item.id,
        requestInfos: requestInfos
      })
      .then(
        () => {
          this.state.response = "Your Request Is Successful";
          this.state.loading = false;
          this.state.updated = true;
          this.setState(this.state);
        },
        error => {
          console.log(error);
          this.state.result = "Request Failed. Please try again";
          this.state.loading = false;
          this.setState(this.state);
        }
      );
  }

  validate(value) {
    if (value) {
      let number = parseInt(value, 10);
      let quantity = this.getRentableQty();
      if (number <= quantity) {
        this.state.amount = number + "";
      } else {
        this.state.amount = quantity + "";
      }
      this.setState(this.state);
    }
  }

  render() {
    let scrollItems = [];
    if (this.item.previousOwners !== undefined) {
      for (let owner of this.item.previousOwners) {
        scrollItems.push(<Text key={owner.email}>{owner.email}</Text>);
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
        {this.state.loading ? (
          <ActivityIndicator />
        ) : (
          <>
            <View style={styles.content}>
              {this.state.imageUrl === "" ? (
                <View style={styles.image}>
                  <Text>Image Is Loading</Text>
                </View>
              ) : (
                <Image
                  source={{ uri: this.state.imageUrl }}
                  style={styles.image}
                  loadingIndicatorSource={<ActivityIndicator />}
                />
              )}
              <Text>{"Item Name : " + this.item.name}</Text>
              <Text>{"Item Type : " + this.item.type}</Text>
              <Text>
                {"Status : " +
                  this.statusMap[this.state.status] +
                  (this.disabledStatuses.indexOf(this.item.status) === -1
                    ? ""
                    : " (Cannot be requested currently)")}
              </Text>
              <Text>{"In Stock : " + this.getRentableQty()}</Text>
              <View style={{ marginTop: 15 }}>
                <TextInput
                  label="Request Amount"
                  onChangeText={this.validate}
                  value={this.state.amount}
                  placeholder="Item Type"
                  keyboardType={"number-pad"}
                />
              </View>
              <View style={styles.buttonRow}>
                {this.disabledStatuses.indexOf(this.state.status) === -1 &&
                this.getRentableQty() > 0 &&
                !this.state.updated ? (
                  <Button
                    compact={true}
                    mode="contained"
                    icon={"check"}
                    onPress={this.request}
                  >
                    {"Request"}
                  </Button>
                ) : (
                  <></>
                )}

                <Button
                  mode="contained"
                  icon={"cancel"}
                  color={"red"}
                  onPress={this.props.navigation.goBack}
                >
                  {"Cancel"}
                </Button>
              </View>
              <Snackbar
                visible={!!this.state.response}
                duration={5000}
                onDismiss={() => {
                  this.state.response = "";
                  this.setState(this.state);
                }}
              >
                {this.state.response}
              </Snackbar>
            </View>
            <View style={styles.owners}>
              {currentOwner}
              <Text>Previous Owners : </Text>
              <ScrollView>{scrollItems}</ScrollView>
            </View>
          </>
        )}
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
    marginTop: 10,
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
