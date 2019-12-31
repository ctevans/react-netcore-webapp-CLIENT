import React, { Component } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../models/activity';

interface IState {
  activities: IActivity[];
}

class App extends Component<{}, IState> {
  readonly state: IState = {
    activities: []
  }

  componentDidMount() {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        this.setState({
          activities: response.data
        })
      })
  }

  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='plug' />
          <Header.Content>Activity Sample App</Header.Content>
        </Header>

        <List>
          {this.state.activities.map((activity) => (
            <li key={activity.id}>{activity.title}</li>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
