import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, Content, List, Text} from 'native-base';
import EventsListEntry from './EventsListEntry.js';

// redux things
import {connect} from 'react-redux';
import { decorateUserWithDBConferenceID, setAdminSelectedConference } from '../actions/actions';




class EventsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };

  }

  render() {
    // console.log('EVENT LIST PROPS -> DATA ', this.state.events);
    return (
    <Content>
        <List>
        {
          this.props.events.map((event, key) => {
            return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                // keeping track of entire event that we clicked on
                this.props.dispatch(setAdminSelectedConference(event));
                this.props.navigation.navigate('AddPresentation');
                this.setState({
                  isDataFetched: false
                });
              }}>
              <EventsListEntry
                eventData={event}
                />
            </TouchableOpacity>
            );
          })
        }
        </List>
      </Content>
    );
  }
}


// REDUX THINGS
const mapStateToProps = (state) => {
  return {
    data: state.adminReducer.data,
    confID: state.adminReducer.confID,
    admin: state.adminReducer,
  };
};

export default connect(mapStateToProps)(EventsList);