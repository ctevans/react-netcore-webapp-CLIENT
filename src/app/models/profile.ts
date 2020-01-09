export interface IProfile {
    displayName: string,
    username: string,
    bio: string,
    image: string,
    following: boolean, //currently logged in user following profile
    followersCount: number,
    followingCount: number,
    photos: IPhoto[]
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}