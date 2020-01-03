import React, { useState, FormEvent, useContext, useEffect } from 'react'
import { Form, Segment, Button, Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from './TextAreaInput';
import SelectInput from './SelectInput';

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const activityStore = useContext(ActivityStore);
    const { createActivity, editActivity, submitting, activity: initialFormState, loadActivity, clearActivity } = activityStore;

    const initializeForm = () => {
        if (initialFormState) {
            return initialFormState;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            }
        }
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(
                () => initialFormState && setActivity(initialFormState));
        }
        return () => {
            clearActivity();
        }
    }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length]);

    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value })
    }

    // const handleSubmit = () => {
    //     if (activity.id.length === 0) {
    //         let newActivity = {
    //             ...activity,
    //             id: uuid()
    //         }
    //         createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
    //     } else {
    //         editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    //     }
    // }

    const handleFinalFormSubmit = (values: any) => {
        console.log(values);
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit} >
                                <Field name='title' placeholder="Title" value={activity.title} component={TextInput} />
                                <Field component={TextAreaInput} name='description' rows={3} placeholder="Description" value={activity.description} />
                                <Field component={SelectInput} options={} name='category' placeholder="Category" value={activity.category} />
                                <Field component={TextInput} name='date' placeholder="Date" value={activity.date} />
                                <Field component={TextInput} name='city' placeholder="City" value={activity.city} />
                                <Field component={TextInput} name='venue' placeholder="Venue" value={activity.venue} />
                                <Button loading={submitting} floated='right' positive type='submit' content="Submit" />
                                <Button onClick={() => history.push('/activities')} floated='right' type='button' content="Cancel" />
                            </Form>
                        )} />
                </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityForm);