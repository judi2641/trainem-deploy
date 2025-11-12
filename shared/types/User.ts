export interface UserInDatabase {
    email: string,
    _id: string, // mongoose property
    __v: number, // mongoose property
}

export interface UserToCreate {
    email: string,
}