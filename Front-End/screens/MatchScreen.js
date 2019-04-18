import React from "react";
import {
  AsyncStorage,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Button,
  View
} from "react-native";
import { WebBrowser } from "expo";
import { MonoText } from "../components/StyledText";
import IceBreaker from "../components/ProfileScreen/IceBreaker";
import LikeButton from "../components/MatchScreen/LikeButton";
import DislikeButton from "../components/MatchScreen/DislikeButton";
import { Users } from "../components/MockedDatabase";
import BioSection from "../components/ProfileScreen/BioSection";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 15
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    height: 150
  }
});

export default class MatchScreen extends React.Component {
  state = {
    UserId: -1,
    OtherUsersIndex: 0,
    OtherUsers: [
      {
        firstName: "",
        lasName: "",
        iceBreaker: { question: "", answer1: "", answer2: "" },
        bio: ""
      }
    ],
    noUsersLeft: false
  };

  static navigationOptions = {
    header: null
  };

  //componentDidMount is run before the component mounts. It makes sense to fetch
  //other users' information here
  componentDidMount = async () => {
    try {
      //find the logged-in user first, then create a copy of the user list so we don't
      //change the original one in the mocked database. Remove the current user from
      //the list, then save it to state.
      const indexString = await AsyncStorage.getItem("userLoggedIn");
      if (indexString) {
        this.setState({ UserId: parseInt(indexString, 10) });
        const UsersDuplicate = Users.slice(0);
        UsersDuplicate.splice(parseInt(indexString, 10), 1);
        const OtherUsers = UsersDuplicate;
        this.setState({
          OtherUsers
        });
        console.log(Users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleGoToNext = () => {
    if (this.state.OtherUsersIndex < this.state.OtherUsers.length - 1) {
      this.setState({
        OtherUsersIndex: this.state.OtherUsersIndex + 1
      });
    } else {
      this.setState({
        noUsersLeft: true
      });
    }
  };

  render() {
    const display = this.state.noUsersLeft ? (
      <View>
        <Text style={{ textAlign: "center" }}>
          Sorry, no one else is using Sprout :/
        </Text>
      </View>
    ) : (
      <>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <IceBreaker
            iceBreaker={
              this.state.OtherUsers[this.state.OtherUsersIndex].iceBreaker
            }
          />
          <BioSection
            user={this.state.OtherUsers[this.state.OtherUsersIndex]}
          />
        </ScrollView>
        <View style={styles.buttonsContainer}>
          <DislikeButton
            userId={this.state.UserId}
            goToNext={this.handleGoToNext}
          />
          <LikeButton
            userId={this.state.UserId}
            likedIndex={this.state.OtherUsers[this.state.OtherUsersIndex].id}
            goToNext={this.handleGoToNext}
          />
        </View>
      </>
    );

    return <View style={styles.container}>{display}</View>;
  }
}
