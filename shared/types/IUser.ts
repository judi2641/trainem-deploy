import {TaskInDatabase} from "./Task"

interface IUser{
    avatar: string,
    img: string,
    personalData: IPersonalData
    onboardingData: IOnboardingData,
    tasks: TaskInDatabase[],   
}
export interface Client extends IUser{

}
export interface Trainer extends IUser{

}



interface IPersonalData {
    userID: string,
    email: string,
    firstName?: string,
    lastName?: string,
    avatar?: string, 
    task?: string,
    usertype: userType,
}


interface IOnboardingData {
    height?: number,
    weight?: number,
    level?: level,
    bodytype?: bodytype
}

enum userType{
    trainer,
    client,
}
enum bodytype {
    fatAsFuck,
    lauch,
    skinnifat,
    normal,
    shredded,
    MarkusRühl,
}
enum level{
    starter,
    intermediate,
    pro,
}