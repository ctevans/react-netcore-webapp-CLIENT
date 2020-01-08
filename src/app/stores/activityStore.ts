import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity'
import agent from '../../api/agent';
import { history } from '../../';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null; //Just observe a reference to hub. Initiate only on activity details page.

    @action createHubConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/chat', {
                //Normally use HTTP header for token, SignalR does not do the same. Uses query string instead!
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .build();

        //Start connection.
        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .catch(error => console.log("Error creating a connection: " + error));
        //Relies on ChatHub.cs definition. Spelling counts here!
        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        })
    };

    @action stopHubConnection = () => {
        this.hubConnection!.stop()
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try {
            //NAme send comment MUST MATCH METHOD NAME ON SERVER!!!!!!!!
            await this.hubConnection!.invoke('SendComment', values);
        } catch (error) {
            console.log(error)
        }
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortiedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )
        return Object.entries(sortiedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction("Loading Activities", () => {
                activities.forEach((activity) => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction("Load Activities Error", () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction("Getting Activity!", () => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction("Get Activity Error!", () => {
                    this.loadingInitial = false;
                })
                console.log(error);
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.isHost = true;
            runInAction("Create Activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction("Create Activity Error", () => {
                this.submitting = false;
            })
            toast.error("Problem Submitting Data");
            console.log(error.response);
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction("Editing Activity", () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction("Editing Activity Error", () => {
                this.submitting = false;
            })
            toast.error("Problem Submitting Data");
            console.log(error.response);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction("Deleting Activity", () => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            })
        } catch (error) {
            runInAction("Deleting Activity Error", () => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;

        try {
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem signing up to activity');
        }

    }

    @action cancelAttendance = () => {
        this.loading = true;
        try {
            agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(
                        a => a.username !== this.rootStore.userStore.user!.username
                    );
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem cancelling attendance')
        }
    }
}