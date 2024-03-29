import {FC,useEffect,useState} from 'react'
import { useUserContext } from '../../hooks/useUserContext';
import { EDisplayBlok,
		TDisplayBlok,
		T_USER_ACCOUNT_MANAGE_BUTTON,
		USER_ACCOUNT_MANAGE_BUTTONS
	} from '../../site-config/user-account-management/user_account_management';
import UserAccountDisplay from './UserAccountDisplay';
import UserAccountManageButton from './UserAccountManageButton'

const UserAccountManage:FC = () => {
	const {userShort} = useUserContext();
	const isUserFilled = userShort?.birthDate && userShort.firstName && userShort.lastName && userShort.userName;
	const defaultDisplayBlok = isUserFilled ? EDisplayBlok.account_info : EDisplayBlok.edit_account;
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
					<UserAccountDisplay displayBlock={displayBlock}/>
				</div>
			</div>
	)
}

export default UserAccountManage;