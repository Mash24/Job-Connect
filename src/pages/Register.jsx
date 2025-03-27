import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from "../firebase/config"
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import BackgroundWrapper from "../components/layouts/BackgroundWrapper";

const Register = () => {
    const navigate = useNavigate(); // to redirect to another page after form submission

    const [ formData, setFormData ] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [ error, setError ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({...prev, [e.target.name]: e.target.value,}));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        const { email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const userRef = doc(db, "users", res.user.uid);
            await setDoc(userRef, {
                uid: res.user.uid,
                email,
                firstname: formData.firstname,
                lastname: formData.lastname,
                createdAt: new Date().toISOString(),
                role: null, // Add the role field here with a default value or logic to determine the role of the newly registered user
            });

            console.log("User created successfully", res.user); // Log the response data to the console
            alert(`Welcome ${formData.firstname}! Registration successful`)

            // Reset form and redirect to login page.
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                confirmPassword: ""
            });

                 navigate('/dashboard');

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const handleGoogleRegister = async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              const res = await signInWithPopup(auth, googleProvider);
              const user = res.user;
          
              const userDocRef = doc(db, "users", user.uid);
              await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                createdAt: new Date().toISOString(),
                role: null, // default role for new users
              }, { merge: true });
          
              alert(`Welcome ${user.displayName}, registration successful!`);
              navigate("/dashboard");
            } catch (error) {
              console.error("Error signing in with Google:", error);
              setError("Google sign-in failed. Please try again later.");
            } finally {
              setLoading(false);
            }
          };          

  return (
    <BackgroundWrapper>
        <div className="flex flex-1 items-center justify-center p-4">
            <div className="bg-white/20 backdrop-blur-md border border-gray-300 shadow-xl p-6 rounded-xl w-full max-w-md text-white">
                <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit = {handleRegister} className='space-y-4'>

                    <input 
                        type="text" 
                        name='firstname'
                        placeholder='First Name'
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 rounded bg-transparent border  border-white placeholder-white'
                    />

                    <input 
                        type="text" 
                        name='lastname'
                        placeholder='Last Name'
                        onChange={handleChange}
                        required
                        className='w-full px-4 py-2 rounded bg-transparent border  border-white placeholder-white'
                    />

                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        onChange={handleChange} 
                        value={formData.email}
                        autoComplete='username'
                        required 
                        className="w-full px-4 py-2 rounded bg-transparent border border-white placeholder-white"
                    />

                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        value={formData.password}
                        autoComplete='new-password' // Prevents password from being saved in browser history and autofill
                        required 
                        className="w-full px-4 py-2 rounded bg-transparent border border-white placeholder-white"
                    />

                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        onChange={handleChange} 
                        value={formData.confirmPassword}
                        autoComplete='new-password' // Prevents password from being saved in browser history and autofill
                        required 
                        className="w-full px-4 py-2 rounded bg-transparent border border-white placeholder-white"
                    />

                    <button 
                        type="submit" 
                        disabled = {loading} 
                        className="w-full py-2 bg-white text-black font-semibold rounded hover:bg-gray-200">
                            {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <p className="mt-4 text-center">or</p>
                    <button onClick={handleGoogleRegister} className='mt-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semi-bold'>Sign up with Google</button>
                </div>

                <div className="mt-4 text-sm text-center">
                    Already have an account? {" "} 
                    <Link to="/login" className='underline hover:text-blue-500'>Login</Link>
                </div>
            </div>
        </div> 
    </BackgroundWrapper>
  );
};

export default Register