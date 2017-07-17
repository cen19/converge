import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet, Dimensions, Image } from 'react-native';
import { Container, Content, Header, Left, Body, Right, Footer, FooterTab, Icon, Button, Title, Text, Form, Item, Input, Label, Radio, ListItem, Separator, CheckBox, SwipeRow } from 'native-base';

import Swiper from 'react-native-swiper';
// import Camera from 'react-native-camera';
// import CameraScreen from './Camera';
import ImagePicker from 'react-native-image-picker';

export default class Register extends Component {
  static navigationOptions = {
    title: 'Register',
  };
  constructor(props) {
    super(props);
    this.state = {
      isAttendee: true,
      avatarSource: ''
    }
  }

  takePicture() {
    let options = {
      title: 'Select Avatar',
      customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        this.setState({
          avatarSource: source
        }, () => console.log('state set for image'));
      }
    });
  }

  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>First Name</Label>
              <Input />
              <Text>{JSON.stringify(this.props.navigation.params)}</Text>
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>linkedIn URL</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Phone Number</Label>
              <Input />
            </Item>

            <Separator bordered>
              <Text style={{alignSelf: 'center'}} note>Attach a profile picture</Text>
            </Separator>

            <Item style={{margin: 5, alignSelf: 'center'}}>
              <TouchableOpacity light onPress={() => this.takePicture()}>
                <Image source={this.state.avatarSource ? this.state.avatarSource : require('../../../../assets/AvatarPlaceHolder.png')} style={{width: 100, height: 100}}></Image>
              </TouchableOpacity>
            </Item>

          </Form>
          <Content style={{height: 50}}>
            <Swiper showsButtons={false}>
                <Button block onPress={() => {this.props.navigation.navigate('ConferenceList')}}>
                  <Text style={{fontSize: 15}}>Register as Attendee</Text>
                </Button>
              <Button block onPress={() => {this.props.navigation.navigate('AdminStack')}}>
                <Text style={{fontSize: 15}}>Register as Host</Text>
              </Button>
            </Swiper>
          </Content>
          <Text style={{alignSelf: 'center'}} note>Swipe For Host</Text>

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 50,
    width: 50
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
