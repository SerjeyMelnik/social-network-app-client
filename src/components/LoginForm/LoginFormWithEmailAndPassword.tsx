import React ,{FC, useState}from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPasswordHandler } from '../../firebase/auth/authWithEmailPassword';
import { useUserContext } from '../../hooks/useUserContext';
import { TAuthMethod } from '../Auth/ChooseAuthMethod';
import FormMessage from '../Auth/FormMessage';
import CustomInput from '../CustomElements/CustomInput';
import LoaderSpiner from '../CustomElements/LoaderSpiner';
import { initEmailAndPasswordForm, TEmailAndPasswordFormType, TFormEmailAndPasswordFields, TFormMessage } from '../RegistrationForm/RegistrationFormWithEmailPassword';


type TLoginFormWithEmailPasswordProps = {
		setAuthMethod: (signInType: TAuthMethod) => void;
	}

const LoginFormWithEmailAndPassword:FC<TLoginFormWithEmailPasswordProps> = ({setAuthMethod}) => {

	const [form,setForm] = useState<TEmailAndPasswordFormType>(initEmailAndPasswordForm);
	const [message,setMessage] = useState<TFormMessage>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigateTo = useNavigate();
	const {login} = useUserContext();
	const changeFieldValue = ( e: React.ChangeEvent<HTMLInputElement>) => {
		setForm(state => {
			const targetErrorMsg = e.target.dataset.errorMsg ? e.target.dataset.errorMsg : '';
			return {...state,[e.target.name]: {error: targetErrorMsg, value: e.target.value }}
		})
	}
	const changeFieldError = (fieldName: TFormEmailAndPasswordFields, errorText: string) => {
		setForm(state => ({...state,[fieldName]: {...state[fieldName], error: errorText }}) )
	}
	const clearErrors = (form: HTMLFormElement) => {
		changeFieldError('email','');
		changeFieldError('password','');
	}
	const clearForm = () =>{
		setForm(initEmailAndPasswordForm)
	}

	const userLogin = async (e:React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(state => !state)
		const formElem = e.target as HTMLFormElement;
		clearErrors(formElem);
		const res = await signInWithEmailAndPasswordHandler(form.email.value,form.password.value);
		setIsLoading(state => !state)
		
		if (!form.email.value){
			changeFieldError('email','???????? ?????????????? ???????? ??????????????????')
			
		}
		if (!form.password.value){
			changeFieldError('password','???????? ?????????????? ???????? ??????????????????')
			return;
		}
		if (res.error){
			if (res.error.code === 'auth/wrong-password'){
				changeFieldError('password','?????????????????????? ???????????????? ????????????')
			}
			else if (res.error.code === 'auth/user-not-found'){
				changeFieldError('email','?????????????????????? ?? ?????????? email ???? ????????????????')
			}
			else if (res.error.code === 'auth/invalid-email'){
				changeFieldError('email','He ???????????????? email')
			}
			else setMessage({type: 'error',text: res.error.code})
		}
		else if (res.user){
			login(res.user)
			navigateTo('/');
			// setMessage({type: 'success',text: 'User logged in successfuly!'})
			setIsLoading(state => !state);
			
		}
	}
	return ( 
		<div className="login_form form">
			<form onSubmit={userLogin}>
				<h3 className='form-title'>Sign In</h3>

				<div className="form-inner">
					<CustomInput type = 'text'
								name = 'email'
								value = {form.email.value}
								placeholder = 'example@gmail.com'
								label = 'Email'
								changeFieldValue = {changeFieldValue}
								error={form.email.error}
								/>
					<CustomInput type = 'password'
								name = 'password'
								value = {form.password.value}
								placeholder = 'password'
								label = 'Password'
								changeFieldValue = {changeFieldValue}
								error={form.password.error}
								/>
					<div className="form-button-wrapper">
						{
							message && 
							<FormMessage message={message} setMessage={setMessage}/>
						}
						
						<button className='button button-login' disabled={isLoading} type='submit'>
							{
								isLoading ?
								<>
									<span>Loading</span>
									<LoaderSpiner/>
								</> :
								<span>Log In</span>
							}
						</button>
						<Link to={'/login'} 
						className='choose-another-method link' 
						onClick={()=>{setAuthMethod(null)}}>
							Choose another method of sign in
						</Link>
					</div>
					
				</div>
			</form>
		</div> 

	 );
}
 
export default LoginFormWithEmailAndPassword;