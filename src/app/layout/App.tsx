import React, { useState, useEffect } from 'react';
import { Header, Icon, List, Container } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/NavBar';

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
      <NavBar />

      <Container style={{ marginTop: '7em' }}>
        <List>
          {activities.map((activity) => (
            <li key={activity.id}>{activity.title}</li>
          ))}
        </List>
      </Container>
    </div>
  );
}

export default App;
