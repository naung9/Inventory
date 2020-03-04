import React from "react";
import { Button, Card, Text, Title } from "react-native-paper";
import formatDateTime from "../services/formatDateTime";
import { View, ScrollView, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";
import FireStoreImage from "./FireStoreImage";

export default class ToDo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemRequests: [],
      loading: false
    };
    this.user = props.user.storeUser;
    this.storageService = props.storageService;
  }

  componentDidMount(): void {
    this.unSubscriber = this.storageService
      .getCollection("item_requests")
      .where("requestBy.email", "==", this.user.email)
      .onSnapshot(async snapshot => {
        if (snapshot !== null) {
          let data = [];
          for (let i = 0; i < snapshot.docs.length; i++) {
            let history = snapshot.docs[i].data();
            history.id = snapshot.docs[i].id;
            console.log("History", history);
            // let itemSnap = await this.storageService.getItemById(
            //   "items",
            //   history.itemId
            // );
            try {
              let itemSnap = await this.storageService
                .getCollection("items")
                .doc(history.itemId)
                .get();
              let item = itemSnap.data();
              if (item) {
                history.item = item;
                data.push(history);
              }
            } catch (e) {
              console.error(e);
            }
          }
          this.state.itemRequests = data;
          this.setState(this.state);
        }
      });
  }

  componentWillUnmount(): void {
    this.unSubscriber();
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

  render() {
    let dataTableData = [];
    this.state.itemRequests.forEach(request => {
      if (request.returnStatus !== "approved") {
        dataTableData.push(
          <View key={request.id} style={{ marginBottom: 2, marginHorizontal: 5 }}>
            <Card>
              <Card.Title
                title={request.item.name}
                left={props => (
                  <View style={{ marginRight: 5 }}>
                    <Text>{"Qty  : " + request.quantity}</Text>
                  </View>
                )}
                right={props => (
                  <FireStoreImage
                    imageName={request.item.imageName}
                    {...props}
                    style={{ width: 75, height: 75 }}
                    fileStore={this.props.fileStore}
                  />
                )}
              />
              <Card.Content>
                <Text>
                  {request.returnStatus !== null
                    ? "Action  : Return"
                    : "Action  : Request"}
                </Text>
                <Text>
                  {request.returnStatus !== null
                    ? "Status  : " + request.returnStatus
                    : "Status  : " + request.requestStatus}
                </Text>
                <Text>
                  {request.returnStatus !== null
                    ? `Time    : ${formatDateTime(request.returnDate.toDate())}`
                    : `Time    : ${formatDateTime(
                        request.requestDate.toDate()
                      )}`}
                </Text>
                <Text>{"From   : " + request.item.currentOwner.name}</Text>
              </Card.Content>
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
    return <ScrollView>{dataTableData}</ScrollView>;
  }
}
const styles = StyleSheet.create({
  buttonRow: {
    marginTop: 10,
    justifyContent: "space-around",
    flexDirection: "row"
  }
});
