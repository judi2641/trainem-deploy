export interface TaskInDatabase {
    name: string,
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
    user_id: string,
    _id: string, // mongoose property
    __v: number, // mongoose property
}

export interface TaskToCreate {
    name: string,
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday",
    user_id: string, 
}