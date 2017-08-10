import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { Container, Content, List, Text, Card} from 'native-base';
import SpeakerListEntry from './SpeakerListEntry';
import randomColor from '../helpers/randomColor';



export default class AddSpeakersList extends Component {
  constructor(props) {
    super(props);
    this.randomColor = randomColor();
  }

  render() {
    return (
      <Content style={{padding: 10}}>
        {
          this.props.speakers.map((speaker, key) => {
            return (
              <SpeakerListEntry
                key={key}
                speaker={speaker}
                navigation={this.props.navigation}
                randomColor={this.randomColor}
              />
            );
          })
        }
      </Content>
    );
  }
}