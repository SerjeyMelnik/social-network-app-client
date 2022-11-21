
import { User } from "firebase/auth";
import { getDoc, doc, DocumentReference } from "firebase/firestore";
import { IPost, TPost } from "../../types/postTypes";
import { IUserFull,TUserFull, TUserShortField, UserShort } from "../../types/userTypes"
import { USER_DATA_NEEDS_TO_FILL } from "../../utils/constants";
import { db } from "../firebase";
import { deleteFolder } from "../storage/daleteFiles";
import { uploadFile } from "../storage/uploadFile";
import { deleteDocumentField } from "./deleteOperation";
import { getCollection, getDocument } from "./getOperation";
import {  getUserPosts } from "./postOperation";
import { setDocument } from "./setOperation";
import { updateDocument } from "./updateOperation";

type TGetFullUserInfo = (userID:string) => Promise<TUserFull>;
type TGetFullUsersInfo = () => Promise<TUserFull[]>;
type TGetShortUserInfoById = (userID:string) => Promise<UserShort>;
type TGetShortUserInfoByRef = (userID:DocumentReference<UserShort>) => Promise<UserShort>;
type TGetShortUsersInfo = () => Promise<UserShort[]>;
type TSetNewUser = (userID: string,user:User) => Promise<void>;
type TUpdateShortUser = (userID:string ,dataToUdate: object) => Promise<void>;
type TUpdateShortUserField = (userID:string ,field: TUserShortField,value:any) => Promise<void>;
type TUploadUserAccountImg = (file: File, userID:string) => Promise<string>;
type TDeleteUserAccountImg = (userID:string) => Promise<void>;

export const getFullUserInfo:TGetFullUserInfo = async (userID:string) => {
	const docSnap = await getDocument('users-full',userID);
	const docData = docSnap.data() as IUserFull; 
	
	const user_short = await getDoc(docData.user_short as DocumentReference<UserShort>);
	const userPosts = await getUserPosts(docData.posts as DocumentReference<IPost>[])
	const res:TUserFull = {
		unfilled: USER_DATA_NEEDS_TO_FILL,
		posts: userPosts as TPost[],
		user_short: user_short.data() as UserShort
	};
	 return res;
}

export const getFullUsersInfo:TGetFullUsersInfo = async () => {
	const usersDocs = await getCollection('users-full');
	const users = usersDocs.docs.map(user=>user.data()) as TUserFull[];
	return users;
}

export const getShortUserInfoById:TGetShortUserInfoById = async (userID:string) => {
	const docSnap = await getDocument('users-short',userID);
	const res = docSnap.data() as UserShort;
	 return res;
}
export const getShortUserInfoByRef:TGetShortUserInfoByRef = async (userRef: DocumentReference<UserShort>) => {
	const docSnap = await getDoc(userRef);
	const res = docSnap.data() as UserShort;
	return res;
}

export const getShortUsersInfo:TGetShortUsersInfo = async () => {
	const docSnap = await getCollection('users-short');
	const res = docSnap.docs.map(user=>user.data()) as UserShort[];
	 return res;
}

export const setNewUser:TSetNewUser = async (userID: string,user:User) => {
	const short_user:UserShort = {
		email:user.email,
		userID: user.uid,
		phoneNumber: user.phoneNumber
	}
	setDocument('users-short',userID,short_user)
	const user_full = {
		unfilled: USER_DATA_NEEDS_TO_FILL,
		user_short: doc(db,'users-short',userID)
	}
	setDocument('users-full',userID,user_full)
}

export const updateShortUser:TUpdateShortUser = async (userID:string ,dataToUdate: object) => {
	await updateDocument('users-short',userID,dataToUdate)
}

export const updateShortUserField:TUpdateShortUserField = async (userID:string ,field: TUserShortField,value:any) => {
	const dataToUpdate = {
		[field]:value
	}
	await updateDocument('users-short',userID,dataToUpdate)
}

export const uploadUserAccountImg:TUploadUserAccountImg = async (file: File,userID:string) => {
	await deleteFolder(`users/${userID}/avatar`);
	const imgUrl = await uploadFile(file,`users/${userID}/avatar/${file?.name}`);
	await updateShortUserField(userID,'avatar',imgUrl);
	return imgUrl;
};

export const deleteUserAccountImg:TDeleteUserAccountImg = async (userID:string) => {
	await deleteDocumentField('users-short',userID,'avatar');
	await deleteFolder(`users/${userID}/avatar`);
}
