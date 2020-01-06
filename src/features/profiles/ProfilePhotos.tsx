import React, { useContext } from 'react'
import { RootStoreContext } from '../../app/stores/rootStore';
import { Card, Image, Header, Tab } from 'semantic-ui-react';

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const { profile } = rootStore.profileStore;
    return (
        <Tab.Pane>
            <Header icon='image' content='Photos'/>
            <Card.Group itemsPerRow={5}>
                {profile?.photos.map((photo) => (
                    <Card key={photo.id}>
                        <Image src={photo.url} />
                    </Card>
                ))}
            </Card.Group>
        </Tab.Pane>
    )
}

export default ProfilePhotos;
