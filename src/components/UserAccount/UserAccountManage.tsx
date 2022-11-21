import {FC,useState} from 'react'
import { useUserContext } from '../../hooks/useUserContext';
import { EDisplayBlok, TDisplayBlok, T_USER_ACCOUNT_MANAGE_BUTTON, USER_ACCOUNT_MANAGE_BUTTONS } from '../../utils/constants'
import UserAccountEdit from './UserAccountEdit';
import UserAccountInfo from './UserAccountInfo';
import UserAccountManageButton from './UserAccountManageButton'
import { UserAccountPosts } from './UserAccountPosts';

const UserAccountManage:FC = () => {
	const {userInfo} = useUserContext();
	const isUserFilled = () => {
		return userInfo?.userFull.unfilled.length == 0
	}
	const defaultDisplayBlok = isUserFilled() ? EDisplayBlok.account_info : EDisplayBlok.edit_account;
	const [displayBlock,setDisplayBlock] = useState<TDisplayBlok>(defaultDisplayBlok);

	return( 
			<div className="user-account-manage">
				<div className="user-account-manage-buttons">
					{
						USER_ACCOUNT_MANAGE_BUTTONS.map((button:T_USER_ACCOUNT_MANAGE_BUTTON) => 
							<UserAccountManageButton key={button.id}
							button={button} 
							setDisplayBlock={setDisplayBlock} 
							displayBlock={displayBlock} 
							/>
							)
					}
				</div>
				<div className="user-account-display">
					{
						displayBlock === EDisplayBlok.account_info ?
						<UserAccountInfo/> :
						displayBlock === EDisplayBlok.edit_account ?
						<UserAccountEdit/> : 
						displayBlock === EDisplayBlok.my_posts ?
						<UserAccountPosts /> : null
					}
					
					
				</div>
			</div>
	)
}

export default UserAccountManage;