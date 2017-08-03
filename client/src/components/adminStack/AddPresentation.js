import React, { Component } from 'react';
import { Container, Content, Header, Left, Toast, List, Grid, Col, ListItem, Right, Body, Title, Text, Button, Tabs, Tab, Icon, Row } from 'native-base';
import { NavigationActions } from 'react-navigation'


import { connect } from 'react-redux';
import axios from 'axios';

import EditConferenceFooter from './helpers/EditConferenceFooter';
import AddPresentationForm from './AddPresentationForm';
import renderListOfDatesFromConference from './helpers/renderListOfDatesFromConference';
import convertDateToEnglish from './helpers/convertDateToEnglish';
import Config from '../../../../config/config.js';
import AdminStackHeader from './helpers/AdminStackHeader';
import { setAdminSelectedPresentation, setSpeakersOfConference, setPresentations, setPresentationSpeakers } from '../actions/actions.js';
import convertArrayToObject from './helpers/convertArrayToObject';
import randomColor from '../helpers/randomColor';


class AddPresentation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: renderListOfDatesFromConference(this.props.admin.selectedConference),
      confID: null,
      presentations: [],
    };
  }

  componentDidMount() {
   this.getPresentations();
   this.getSpeakersOfConf();
   this.props.dispatch(setAdminSelectedPresentation({}));
   this.props.dispatch(setPresentationSpeakers({}));
  }

  getSpeakersOfConf() {
    const SERVER_URL = Config.server.url || 'http://localhost:3000';
    axios.get(SERVER_URL + `api/speakers/${this.props.admin.selectedConference.id}`)
    .then(response => {
      this.props.dispatch(setSpeakersOfConference(response.data));
    })
    .catch(error => {
      console.log('error getting speakers: ', error);
    });
  }

  getPresentations() {
    const SERVER_URL = Config.server.url || 'http://localhost:3000';
    const getAllPresentationsWithConferenceIdUrl = SERVER_URL + 'api/presentations/' + this.props.admin.selectedConference.id
    axios.get(getAllPresentationsWithConferenceIdUrl)
      .then(presentations => {
        this.props.dispatch(setPresentations(presentations.data));
        this.setState({
          presentations: presentations.data
        })
      })
      .catch(err => {
        console.log('error fetching presentations: ', err);
      });
  }

  handleItemPress(presentation) {
    // used for editing the presentation details
    console.log('presentation clicked: ', presentation.name);

    this.props.dispatch(setPresentationSpeakers(convertArrayToObject(presentation.speakers, 'id')))
    this.props.dispatch(setAdminSelectedPresentation(presentation));
    this.props.navigation.navigate('AddPresentationForm', {editMode: true});
  }

  handleDeletePress(presentation) {
    axios.delete(`${Config.server.url}api/presentations/${presentation.id}`)
      .then(response => {
        this.getPresentations();
        Toast.show({
            text: `${presentation.name} deleted`,
            position: 'bottom',
            type: 'warning',
            duration: 1500
         });
      });
  }

  render() {
    var colors = ['#ff2d55', '#5856d6', '#007aff', '#5ac8fa', '#ffcc22', '#ff954f', '#ff3b30'];



    return (
      <Container>
        <AdminStackHeader
          navigation={this.props.navigation}
          leftNavigation="AdminLanding"
          leftIcon="arrow-back"
          title="Presentations"
          rightNavigation="AddPresentationForm"
          rightIcon= "add"
        />

        <Tabs initialPage={0}>
          {
            this.state.dates.map((date, i) => {
              return (
                <Tab key={i} heading={date}>
                  <Content>
                    {
                      this.state.presentations.filter(presentation => {
                        return convertDateToEnglish(presentation.date) === date;
                      }).map((presentation, i) => {
                        return (
                          <List key={i}>
                            <ListItem avatar onPress={this.handleItemPress.bind(this, presentation)}>
                              <Grid>
                                <Row style={{alignItems: 'center'}}>
                                  <Col style={{width: '82%'}}>
                                      <Grid>
                                        <Row style={{alignItems: 'center'}}>
                                        <Col style={{width: '28%'}}>
                                          <Row style={{alignItems: 'center'}}>
                                              <Col style={{ backgroundColor:  randomColor(), height: 50, width: 5}} />
                                            <Text style={{paddingLeft: 10, marginRight: 0}}>{presentation.time}</Text>
                                          </Row>
                                        </Col>
                                        <Col style={{width: '72%'}}>
                                          <Body>
                                            <Text>{presentation.name}</Text>
                                            <Text note>{presentation.location}</Text>
                                          </Body>
                                        </Col>
                                      </Row>
                                    </Grid>
                                  </Col>
                                <Col style={{width: '18%', alignItems: 'center'}}>
                                  <Button small transparent onPress={this.handleDeletePress.bind(this, presentation)}>
                                      <Icon name="trash" style={{color: '#428bca'}}/>
                                    </Button>
                                </Col>
                              </Row>
                            </Grid>
                          </ListItem>
                        </List>
                        )
                      })
                    }
                  </Content>
                </Tab>
              )
            })
          }
        </Tabs>
        <EditConferenceFooter navigation={this.props.navigation} />

      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    admin: state.adminReducer,
    user: state.userReducer
  }
}

export default connect(mapStateToProps)(AddPresentation);
