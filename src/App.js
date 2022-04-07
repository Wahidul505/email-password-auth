import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import app from './firebase.init';
import { useState } from 'react';

const auth = getAuth(app);

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passError, setPassError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registered, setRegistered] = useState(false);
  const handleNameBlur = e => {
    setName(e.target.value);
  }
  const handleEmailBlur = e => {
    setEmail(e.target.value);
  };
  const handlePasswordBlur = e => {
    setPassword(e.target.value);
  };
  const handleRegisteredChange = e => {
    setRegistered(e.target.checked);
  }
  const handleSubmit = e => {
    e.preventDefault();
    if (!/@.*?\./.test(email)) {
      setEmailError('Please Provide a @ and period in your email');
      return;
    }
    else if (!/(?=.*?[#?!@$%^&*-])/.test(password)) {
      setEmailError('');
      setPassError('The Password should have at least one special character');
      return;
    }
    setPassError('');
    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(res => {
          const user = res.user;
          console.log(user);
        })
        .catch(err => {
          console.log(err);
          setLoginError(err.message.slice(22, err.message.length - 2));
        })
    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
          const user = res.user;
          console.log(user);
          verifyEmail();
          getUserName();
        })
        .catch(err => {
          console.log(err);
          setLoginError(err.message.slice(22, err.message.length - 2));
        });
    }
    setLoginError('');
  }
  const getUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    }).then(() => console.log('Updating Name'));
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(res => console.log('Email send for verification'));
  };
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(res => console.log('Email send to reset password'));
  }
  return (
    <div>
      <form className='p-4 border border-gray-300 rounded-xl w-1/2 mx-auto my-16 flex flex-col' onSubmit={handleSubmit}>
        <h1 className='text-2xl text-blue-400 font-semibold mb-4'>{registered ? 'Please Login' : 'Please Register'}</h1>
        {
          !registered && <div><p className='text-xl text-blue-700'>Your Name</p>
            <input className='border border-gray-300 rounded-lg p-1' onBlur={handleNameBlur} type="text" placeholder='Enter Name' required />
          </div>}
        <p className='text-xl text-blue-700 mt-4'>Email Address</p>
        <input className='border border-gray-300 rounded-lg p-1' onBlur={handleEmailBlur} type="email" placeholder='Enter Email' required />
        <p className='text-red-600 text-sm'>{emailError}</p>
        <p className='text-xl text-blue-700 mt-4'>Password</p>
        <input className='border border-gray-300 rounded-lg p-1' onBlur={handlePasswordBlur} type="password" name="" id="" placeholder='Password' required />
        <p className='text-red-600 text-sm'>{passError}</p>
        <p className='text-green-600 my-2'><input onChange={handleRegisteredChange} className='mr-1' type="checkbox" name="" id="" />Already Registered?</p>
        <p className='text-red-600 text-sm'>{loginError}</p>
        <p><button onClick={handleResetPassword} className='underline text-amber-600'>Forgot Password?</button></p>
        <input className='bg-blue-600 text-white w-1/4 ms-0 rounded-xl p-1 mt-4 cursor-pointer' type="submit" value={registered ? 'Login' : 'Register'} />
      </form>
    </div>
  );
}

export default App;
