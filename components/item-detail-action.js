import React from "react";
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  Text,
  TextInput,
  Title
} from "react-native-paper";
import firestore from "@react-native-firebase/firestore";
import { Image, ScrollView, StyleSheet, View } from "react-native";

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
    this.cancel = this.cancel.bind(this);
    this.retry = this.retry.bind(this);
    this.returnRequest = this.returnRequest.bind(this);
    this.saveRequest = this.saveRequest.bind(this);
    this.storageService = props.storageService;
    this.fileStore = props.fileStore;
    this.disabledStatuses = ["rented", "lost"];
    this.user = props.user.storeUser;
    this.state = {
      loading: false,
      updated: false,
      imageUrl: "",
      amount: "1",
      response: "",
      itemRequests: []
    };
  }

  getRentableQty() {
    this.rentedQty = 0;
    this.state.itemRequests.forEach(request => {
      if (
        request.requestStatus !== "denied" &&
        request.returnStatus !== "approved"
      )
        this.rentedQty += request.quantity;
    });
    let qty = this.item.quantity - this.rentedQty;
    return qty >= 0 ? qty : 0;
  }

  componentDidMount(): void {
    this.unSubscriber = this.storageService
      .getCollection("item_requests")
      .where("itemId", "==", this.item.id)
      .onSnapshot(snapshot => {
        if (snapshot !== null) {
          let data = [];
          snapshot.forEach(doc => {
            let request = doc.data();
            request.id = doc.id;
            data.push(request);
          });
          console.log(data);
          this.state.itemRequests = data;
          this.state.loading = false;
          this.setState(this.state);
        }
      });
    this.imageStoreRef = this.fileStore.ref("items/" + this.item.imageName);
    this.imageStoreRef.getDownloadURL().then(
      value => {
        this.state.imageUrl = value;
        this.setState(this.state);
      },
      error => {
        console.log(error);
        this.state.loading = false;
        this.setState(this.state);
      }
    );
  }

  componentWillUnmount(): void {
    this.unSubscriber();
  }

  request() {
    this.state.loading = true;
    this.setState(this.state);
    this.storageService
      .addItem("item_requests", {
        requestStatus: "pending",
        requestDate: firestore.Timestamp.fromDate(new Date()),
        returnStatus: null,
        returnDate: null,
        requestBy: this.user,
        itemId: this.item.id,
        quantity: parseInt(this.state.amount, 10)
      })
      .then(
        requestSnapShot => {
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
    } else {
      this.state.amount = value;
      this.setState(this.state);
    }
  }

  saveRequest(itemRequest) {
    this.state.loading = true;
    this.setState(this.state);
    this.storageService.saveItem("item_requests", itemRequest).then(
      result => {
        console.log(result);
        this.state.loading = false;
        this.setState(this.state);
      },
      error => {
        console.log(error);
        this.state.loading = false;
        this.setState(this.state);
      }
    );
  }

  retry(itemRequest) {
    console.log("Retrying", itemRequest);
    if (itemRequest.returnStatus !== null) {
      itemRequest.returnStatus = "pending";
      itemRequest.returnDate = firestore.Timestamp.fromDate(new Date());
    } else {
      itemRequest.requestStatus = "pending";
      itemRequest.requestDate = firestore.Timestamp.fromDate(new Date());
    }
    this.saveRequest(itemRequest);
  }

  cancel(itemRequest) {
    if (itemRequest.returnStatus !== null) {
      itemRequest.returnStatus = null;
      itemRequest.returnDate = null;
      this.saveRequest(itemRequest);
    } else {
      this.state.loading = true;
      this.setState(this.state);
      this.storageService.deleteItem("item_requests", itemRequest.id).then(
        result => {
          console.log("Delete Result :", result);
          this.state.loading = false;
          this.setState(this.state);
        },
        error => {
          console.log(error);
          this.state.loading = false;
          this.setState(this.state);
        }
      );
    }
  }

  returnRequest(itemRequest) {
    itemRequest.returnStatus = "pending";
    itemRequest.returnDate = firestore.Timestamp.fromDate(new Date());
    this.saveRequest(itemRequest);
  }

  formatDateTime(dateTime) {
    let year = dateTime.getFullYear() + "";
    let month = dateTime.getMonth() + 1 + "";
    let date = dateTime.getDate() + "";
    let hour = dateTime.getHours() + "";
    let minutes = dateTime.getMinutes() + "";
    month.length === 1 && (month = "0" + month);
    date.length === 1 && (date = "0" + date);
    hour.length === 1 && (hour = "0" + hour);
    minutes.length === 1 && (minutes = "0" + minutes);
    return year + "-" + month + "-" + date + " " + hour + ":" + minutes;
  }

  render() {
    let itemRequestViews = [];
    this.state.itemRequests.forEach(request => {
      if (
        request.requestBy.id === this.user.id &&
        request.returnStatus !== "approved"
      ) {
        itemRequestViews.push(
          <View key={request.id} style={{ marginBottom: 2 }}>
            <Card>
              <Card.Title
                title={
                  request.returnStatus !== null
                    ? `Return At ${this.formatDateTime(
                        request.returnDate.toDate()
                      )}`
                    : `Request At ${this.formatDateTime(
                        request.requestDate.toDate()
                      )}`
                }
                subtitle={
                  request.returnStatus !== null
                    ? "Status : " + request.returnStatus
                    : "Status : " + request.requestStatus
                }
                right={props => (
                  <View style={{ marginRight: 5 }}>
                    <Text>{"Qty : " + request.quantity}</Text>
                  </View>
                )}
              />
              <Card.Actions>
                <View style={styles.buttonRow}>
                  {request.requestStatus === "pending" ||
                  request.returnStatus === "pending" ? (
                    <Button onPress={() => this.cancel(request)}>Cancel</Button>
                  ) : null}
                  {request.requestStatus === "denied" ||
                  request.returnStatus === "denied" ? (
                    <Button onPress={() => this.retry(request)}>Retry</Button>
                  ) : null}
                  {request.requestStatus === "approved" &&
                  request.returnStatus === null ? (
                    <Button onPress={() => this.returnRequest(request)}>
                      Return
                    </Button>
                  ) : null}
                </View>
              </Card.Actions>
            </Card>
          </View>
        );
      }
    });
    if (this.state.loading)
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    return (
      <View style={styles.container}>
        <ScrollView>
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
                    this.statusMap[this.item.status] +
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
                  this.getRentableQty() > 0 ? (
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
                {itemRequestViews}
              </View>
              <View style={styles.owners}>
                <Title>
                  {"Current Owner : " + this.item.currentOwner.name}
                </Title>
              </View>
            </>
          )}
        </ScrollView>
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
