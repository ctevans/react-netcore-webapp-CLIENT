import React from 'react'
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activities: IActivity[]
}

export const ActivityDashboard: React.FC<IProps> = ({ activities }) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <List>
                    {activities.map((activity) => (
                        <li key={activity.id}>{activity.title}</li>
                    ))}
                </List>
            </Grid.Column>
        </Grid>
    )
}
