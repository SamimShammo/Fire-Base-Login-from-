import React, { useState } from 'react';
import initializeAuthentication from '../Login-FireBase/Firebase.init';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile} from "firebase/auth";

initializeAuthentication();

const Login = () => {
    // useState set user
    const [name , setUserName] = useState('')
    const [isLogin, setIslogin] = useState(false)
    const [error , setError] = useState('')
   
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    // useState set user
    const auth = getAuth()
    const nameChange = e => {
        setUserName(e.target.value)
        
    }
    
    const checkRegister =e =>{
        setIslogin(e.target.checked)
    }
    const emailChange = e => {
        setEmail(e.target.value)
    }
    const passwordChange = e => {
        setPassword(e.target.value)
    }
    
    // password check 
    const submitHandler = e =>{
        e.preventDefault()
        if(password.length < 6){
            setError('Password Must be 6 Character long')
         return;
        
        }
        if(!/(?=.*[A-Z].*[A-Z])/.test(password)){
            setError('Password must 2 letters in Upper Case')
            return;
        }
        if(!/(?=.*[!@#$&*])/.test(password)){
            setError('Password must 1 Special Character')
            return;
        }
        // Login check 
      if(isLogin){
        processLogin(email, password)
      }
     //  register check 
      else{
          createNewUser(email, password)
      }
       
        
    }
    // Login process 
     const processLogin = (email, password)=>{
        signInWithEmailAndPassword(auth, email, password)
        .then(result=>{
            const user = result.user
            console.log(user)
            setError('')
        })
        .catch(error=> {
            setError(error.message)
        })
     }
    //  createNewUser process 
    const createNewUser = (email, password) =>{
        createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
            const user = result.user
            console.log(user)
            setError('')
            verifyEmail()
            setNewUser()
       })
        .catch(error=> {
           setError(error.message)
        })
    }

    // email verification 
    const verifyEmail = () => {
        sendEmailVerification(auth.currentUser)
        .then(result => {
            console.log(result)
        })
    }
    // email verification 
    const resetPassword = () => {
        sendPasswordResetEmail(auth, email)
        .then(result => {
            console.log(result)
        })
    }
    const setNewUser = () => {
        updateProfile(auth.currentUser, {
            displayName: name})
            .then(result => {
                console.log(result)
            })
            

    }


  
    return (
        <div className="mx-5 my-5 col-lg-8">
        <form onSubmit={submitHandler}>
            <h2 className="text-primary">Please {isLogin ?  'Login': 'Register'}</h2>
            <div className="row mb-3">
                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                <input onBlur={emailChange} type="email" className="form-control" id="inputEmail3" required/>
                </div>
            </div>
           {!isLogin && <div className="row mb-3">
                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                <div className="col-sm-10">
                <input onBlur={nameChange} type="text" className="form-control" id="name" required/>
                </div>
            </div>}
            <div className="row mb-3">
                <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                <input onBlur={passwordChange} type="password" className="form-control" id="inputPassword3" required/>
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-sm-10 offset-sm-2">
                <div className="form-check">
                    <input onChange={checkRegister} className="form-check-input" type="checkbox" id="gridCheck1"/>
                    <label className="form-check-label" htmlFor="gridCheck1">
                    {isLogin ? ' Login' : 'Register'}
                    </label>
                </div>
                </div>
            </div>
            <div className="row mb-3 text-danger">
                {error}
            </div>
            <button type="submit" className="btn btn-danger  " onClick={resetPassword}>Reset Password</button> 
            <button type="submit" className="btn btn-primary ms-2">Register</button>
            </form>
        </div>
    );
};

export default Login;