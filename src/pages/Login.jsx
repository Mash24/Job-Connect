import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

import TITLE from '../components/common/Title' 
import BackgroundWrapper from '../components/layouts/BackgroundWrapper';


const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e)=>{
        setFormData((prev) => ({...prev,[e.target.name]: e.target.value,}));
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
    
    const {email, password } = formData;

        try{
            setLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Fetch user's data from Firestore
            const userDocRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userDocRef);

            let firstName = 'there';
            if (userSnap.exists()){
                firstName = userSnap.data().firstName || 'there';
            }


            alert(`Welcome back, ${firstName}!`);
            console.log('You are logged in successfully!');
            
            navigate('/dashboard');

        }catch(err){
            console.error('Login error:', err);
            if(err.code ==='auth/user-not-found') {
                setError('No account found with this email address. Please sign up first.');
            } else if (err === 'auth/wrong-password') {
                setError('Invalid password. Please try again.');
            }else{
                setError('An error occurred during login. Please try again later.');
            }
        }finally{
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        try {
            setLoading(true);
            await signInWithPopup(auth, googleProvider)
            alert('Logged in successfully!');
            console.log('You are logged in successfully with Google!');
            navigate('/dashboard');
            } catch (err) {
            console.error('Google login error:', err);
            setError('An error occurred during Google login. Please try again later.');
            } finally {
            setLoading(false);
             }
        };

    const handleForgotPassword = () => {
        navigate('/reset-password')
    };

    
  return (
    <BackgroundWrapper>
        <div className='flex flex-1 items-center justify-center p-4'>
            <div className='bg-white/20 backdrop-blur-md border border-gray-300 shadow-xl p-6 rounded-xl w-full max-w-md text-white'>
                <h2 className='text-2xl font-bold text-center mb-4'>Welcome back to {TITLE} </h2>
                {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}

                <form onSubmit = {handleLogin} className='space-y-4'>
                    <input 
                        type="email"
                        name="email"
                        placeholder='Email Address'
                        onChange={handleChange}
                        value={formData.email}
                        autoComplete='username'
                        required
                        className='w-full px-4 py-2 rounded bg-transparent border border-white placeholder-white'
                    />

                    <input 
                        type="password"
                        name="password"
                        placeholder='Enter Password'
                        onChange={handleChange}
                        value={formData.password}
                        autoComplete='current-password'
                        required
                        className='w-full px-4 py-2 rounded bg-transparent border border-white placeholder-white'
                    />

                    <button
                    type="submit"
                    disabled={loading}
                    className='w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600'
                    >
                        
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>

                </form>

                <div className="mt-2 text-center text-sm">
                    <button
                    type='button'
                    onClick={handleForgotPassword}
                    className='underline hover:text-blue-400'
                    >
                        Forgot Password?
                    </button>
                </div>

                <div className='mt-4 text-center'>
                    <p className='mt-4 text-center'>or</p>
                    <button
                    type='button'
                        onClick={handleGoogleLogin}
                        className='mt-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semi-bold'
                    >
                        Sign in with Google
                    </button>
                </div>

                <div className='mt-4 text-sm text-center'>
                    Don't have an account? {' '}
                    <Link to="/register" className='underline hover:text-blue-400'> Register</Link>
                </div>

            </div>
        </div>
    </BackgroundWrapper>
  ) 
}

export default Login