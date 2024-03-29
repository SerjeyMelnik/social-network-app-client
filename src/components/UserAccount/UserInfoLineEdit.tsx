import {FC,useState,ChangeEventHandler} from 'react'
import CustomInput from '../CustomElements/CustomInput';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { TUserShortField } from '../../types/userTypes';
import { updateShortUser, updateUser } from '../../firebase/firestore/userOperation';
import LoaderSpiner from '../CustomElements/LoaderSpiner';
import { useAuthProvider } from '../../context-providers/AuthProvider';

type TUserInfoLineEditProps = {
	name:TUserShortField,
	label:string,
	value?: string | undefined | null 
}

const UserInfoLineEdit:FC<TUserInfoLineEditProps> = ({name,label,value}) => {
	const {currentUser} = useAuthProvider()
	const [isEdit,setIsEdit] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [fieldValue,setFieldValue] = useState<string | undefined | null >(value);
	const toggleEdit = () => {
		setIsEdit(state => !state)
	}
	const saveEditedUserInfo = async () => {
		setLoading(state => !state)
		const dataToUpdate = {
			[name]: fieldValue
		}
		
		await updateShortUser(currentUser?.uid as string,dataToUpdate)
		if(name === 'userName'){
			updateUser({displayName: fieldValue});
		}
		setLoading(state => !state)
		toggleEdit(); 
	}
	const  changeFieldValue:ChangeEventHandler<HTMLInputElement> = (e) => {
		setFieldValue(e.target.value)
	}
	return (
		<div className="user_info_line editable">
				<label className='user_info_line-property'>
					{label}<span style={{color:'red'}}>*</span>: 
				</label>
				<CustomInput type = 'text'
							name = {name}
							value = {fieldValue}
							placeholder = {`Please fil out this field`}
							changeFieldValue = { changeFieldValue }
							className='input-editable'
							disabled={!isEdit}
								/>
				{
					!isEdit ?

					<button className='button-user_info_line_edit edit' onClick={toggleEdit}>
						<EditRoundedIcon />
					</button> :

					<button className={`button-user_info_line_edit save`} disabled={loading} onClick={saveEditedUserInfo}>
						{
							loading ? 
							<LoaderSpiner/>:
							<CheckRoundedIcon/>
						}
					</button>
						
				}				
		</div>
	)
}
export default UserInfoLineEdit;