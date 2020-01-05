import React, { useContext, Fragment } from 'react'
import { Item, Image, Label, Button, Segment } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { Link } from 'react-router-dom'
import ActivityListItem from './ActivityListItem'
import { RootStoreContext } from '../../../app/stores/rootStore'

const ActivityList: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { activitiesByDate } = rootStore.activityStore;

    return (
        <Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment>
                    <Label key={group} size='large' color="blue">
                        {group}
                    </Label>
                        <Item.Group divided>
                            {activities.map(activity => (
                                <ActivityListItem key={activity.id} activity={activity} />
                            ))}
                        </Item.Group>
                </Fragment>
            ))}
        </Fragment>
    )
}

export default observer(ActivityList);
