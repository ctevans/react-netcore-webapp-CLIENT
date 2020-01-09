import React from 'react'
import { Tab } from 'semantic-ui-react';
import ProfilePhotos from './ProfilePhotos';
import ProfileDescription from './ProfileDescription';
import ProfileFollowings from './ProfileFollowings';

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

const panes = [
    {
        menuItem: 'About',
        render: () => <ProfileDescription />
    },
    {
        menuItem: 'Photos',
        render: () => <ProfilePhotos />
    },
    {
        menuItem: 'Events',
        render: () => <Tab.Pane>Events content</Tab.Pane>
    },
    {
        menuItem: 'Followers',
        render: () => <Tab.Pane><ProfileFollowings /></Tab.Pane>
    },
    {
        menuItem: 'Following',
        render: () => <Tab.Pane><ProfileFollowings /></Tab.Pane> //Same component for followers/.following
    }
]

const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
    return (
        <Tab
            menu={{ fluid: true, vertical: true }}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)}
        />
    )
}

export default ProfileContent;