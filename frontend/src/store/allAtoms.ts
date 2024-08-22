import { atom,selector } from "recoil";

export interface clientDataType{
    name:string,
    Roomname:string
}
// {senderId: 1, type: 'MESSAGE', data: 'hey whats up', roomId: 2}
export interface messageType{
    senderId:number,
    type:string,
    data:string,
    roomId:number
}
export interface userType{
    id:number,
    token:string,
    name:string,
    email:string
}
export const userAtom = atom<userType | null>({
    key: 'atomForTheUser',
    default: null,
  });
export const allUsers=atom({
    key:"alltheusersexceptself",
    default:[]
})
export const allmessage=atom<messageType[]>({
    key:"allthemessages",
    default:[]
})
export const clientAndRoom=atom<clientDataType[]>({
    key:"clientNameAndRoomname",
    default:[]
})
// export const  thisRoom=atom({
//   key:"roomimCurrentlyIN",
//   default:{}
// })
export const alltherooms=atom({
    key:"alltherooms",
    default:[]
})