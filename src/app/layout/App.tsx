import React, { useState, useEffect } from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../models/activity';

const App = () => {

  const [activities, setActivities] = useState<IActivity[]>([]);
  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
      .then((response) => {
        setActivities(response.data)
      })
  }, []);

  return (
    <div>
      <Header as='h2'>
        <Icon name='plug' />
        <Header.Content>Activity Sample App</Header.Content>
      </Header>

      <List>
        {activities.map((activity) => (
          <li key={activity.id}>{activity.title}</li>
        ))}
      </List>
    </div>
  );
}

export default App;
