import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform
} from 'react-native';
import { Container, Button, Right, CheckBox, Body, Input, ListItem, Label, Item, Content, Separator, Text, Footer, FooterTab, Picker, Icon } from 'native-base';

import axios from 'axios';
import DatePicker from './DatePicker.js';

import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import Config from '../../../../config/config.js';
import AdminStackHeader from './helpers/AdminStackHeader';



const renderInput = ({ input: { onChange, ...restInput }, label, keyboardType, placeholder, normalize, multiline}) => {
  console.log('label: ', label)
  return (
    <Item inlineLabel>
      <Label>{label}</Label>
      <Input keyboardType={keyboardType} onChangeText={onChange} {...restInput} normalize={normalize} placeholder={placeholder} multiline={multiline}/>
    </Item>
  )
}

class AddPresentationForm extends Component {
  static navigationOptions = {
    title: 'Add A Presentation',
    headerLeft: <Button transparent onPress={() => navigation.navigate('AddPresentation')}><Icon name="menu"/></Button>
  }
  constructor(props) {
    super(props);
    this.state = {
      selectedDate: '',
      selectedTime: '',
      selectedSpeakerID: 0,
      speakers: [
        {
          first_name: 'John',
          last_name: 'Doe',
          id: 1
        },
        {
          first_name: 'Jane',
          last_name: 'Doe',
          id: 2
        },
        {
          first_name: 'Jack',
          last_name: 'Frost',
          id: 3
        }
      ],
      selectedSpeakers: {}
    }
    const SERVER_URL = Config.server.url || 'http://localhost:3000';
    let getAllSpeakersByConferenceIdUrl = SERVER_URL + 'api/speakers/' + this.props.admin.selectedConference.id;
    axios.get(getAllSpeakersByConferenceIdUrl)
      .then( speakers => {
        console.log('speakers: ', speakers.data);
        this.setState({
          speakers: speakers.data
        })
      })
      .catch(err => {
        console.log('Error getting speakers: ', err);
      })
  }

  saveToDB(presentation) {
    const SERVER_URL = Config.server.url || 'http://localhost:3000';
      let url = SERVER_URL + 'api/AddPresentation';
      let data = {};
      data.presentation = presentation;
      data.speakers = this.state.selectedSpeakers
      console.log('presentation: ', presentation);
      axios.post(url, data)
        .then(response => {
          console.log('response : ', response);
          this.props.navigation.navigate('AddPresentation');
        })
        .catch(error => {
          console.log('Error saving presentation: ', error);
        })
    }

  submit(presentation) {
    presentation.conference_id = this.props.admin.selectedConference.id;
    presentation.date = this.state.selectedDate;
    presentation.time = this.state.selectedTime;
    this.saveToDB(presentation);
  }

  onSpeakerChange(value) {
    this.setState({
      selectedSpeakerID: value
    });
  }

  onDateChange(value) {
    this.setState({
      selectedDate: value.slice(0,11)
    })
  }

  onTimeChange(value) {
    this.setState({
      selectedTime: value
    })
  }

  handleCheckBoxPress(id) {
    if (this.state.selectedSpeakers[id] === undefined) {
      this.state.selectedSpeakers[id] = true;
    } else {
      this.state.selectedSpeakers[id] = !this.state.selectedSpeakers[id]
    }
    this.setState({
      selectedSpeakers: this.state.selectedSpeakers
    })
  }

  render() {
    console.log('props in AddPresentationForm: ', this.props);
    const { handleSubmit } = this.props;
    return (
      <Container>
        <AdminStackHeader
          navigation={this.props.navigation}
          leftNavigation="AddPresentation"
          leftIcon="arrow-back"
          title="Presentations"
          rightIcon= "trash"
        />
        <Content>
          <Field name="name" component={ renderInput } label="Presentation Name:" placeholder="React Native Best Practices" />
          <Item inlineLabel>
            <Label>Date: </Label>
            <DatePicker showIcon={false} onChange={this.onDateChange.bind(this)} minDate={this.props.admin.selectedConference.start_date} maxDate={this.props.admin.selectedConference.end_date} />
          </Item>
          <Item inlineLabel>
            <Label>Time: </Label>
            <DatePicker showIcon={false} mode={'time'} onChange={this.onTimeChange.bind(this)} />
          </Item>

          <Field name="location" component={ renderInput } label="Location:" placeholder="Twin Peaks Room" />
          <Field name="description" component={ renderInput } label="Description:" placeholder="Developing with React Native...." multiline={true} />
           <Label>Speakers:</Label>
           <Content>
             {
               this.state.speakers.map((speaker, i) => {
                 return <ListItem>
                          <CheckBox onPress={this.handleCheckBoxPress.bind(this, speaker.id)} checked={this.state.selectedSpeakers[speaker.id]}/>
                          <Body>
                            <Text>{speaker.first_name + ' ' + speaker.last_name}</Text>
                          </Body>
                        </ListItem>
               })
             }
           </Content>
        </Content>
        <Footer>
          <Content style={{backgroundColor: '#428bca'}}>
            <Button style={{flex: 1, alignSelf: 'center'}} transparent onPress={handleSubmit(this.submit.bind(this))}>
              <Text style={{fontSize: 15, fontWeight: 'bold', color: 'white'}}>Add Presentation</Text>
            </Button>
          </Content>
        </Footer>
      </Container>
    )
  }
}

AddPresentationForm = reduxForm({
  form: 'AddPresentation'
})(AddPresentationForm)

AddPresentationForm = connect(
  state => ({
    admin: state.adminReducer
  })
  )(AddPresentationForm)

export default AddPresentationForm


