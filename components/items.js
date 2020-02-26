import React from "react";
import { FlatList, StyleSheet } from "react-native";
import ItemListItem from "./item-li";
import { Searchbar, FAB } from "react-native-paper";

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], showItems: [] };
    this.filterItems = this.filterItems.bind(this);
  }
  componentDidMount(): void {
    this.unsubscriber = this.props.storageService
      .getCollection("items")
      .onSnapshot(snapshot => {
        if (snapshot !== null) {
          let data = [];
          let showItems = [];
          snapshot.forEach(doc => {
            let item = doc.data();
            item.id = doc.id;
            data.push(item);
            showItems.push(doc.id);
          });
          this.setState({
            items: data,
            showItems:
              this.state.showItems.length === 0
                ? showItems
                : this.state.showItems
          });
        }
      });
  }

  componentWillUnmount(): void {
    this.unsubscriber();
  }

  filterItems(query) {
    let currentItems = this.state.items;
    query = query.toLowerCase();
    this.setState({
      items: currentItems,
      showItems: currentItems
        .filter(
          item =>
            item.name.toLowerCase().indexOf(query) !== -1 ||
            item.type.toLowerCase().indexOf(query) !== -1
        )
        .map(item => item.id)
    });
  }

  render() {
    return (
      <>
        <Searchbar
          style={{ margin: 10 }}
          placeholder={"Search Items"}
          onChangeText={this.filterItems}
        />
        <FlatList
          data={this.state.items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return <ItemListItem {...this.props} item={item} />;
          }}
        />
        <FAB
          style={styles.fab}
          icon={"plus"}
          onPress={() => this.props.navigation.navigate("ItemDetail")}
        />
      </>
    );
  }
}
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    backgroundColor: "blue",
    bottom: 20,
    right: 20
  }
});
