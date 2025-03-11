import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const RecruiterLogin = () => {

    const [state, setState] = useState('Login')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [image, setImage] = useState(false)
    const [isTextDataSubmited, setIsTextDataSubmited] = useState(false)

    const {setShowRecruiterLogin} = useContext(AppContext)

    useEffect(() => {
        // Disable scrolling when component mounts
        document.body.style.overflow = 'hidden'

        // Re-enable scrolling when component unmounts
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [])

    const onSubmitHandler = async(e) =>{
        e.preventDefault()

        if (state === "Sign Up" && !isTextDataSubmited) {
            setIsTextDataSubmited(true)
        } else if (state === "Login") {
            console.log("Login form submitted")
        }
    }

    return (
        <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>Recruiter {state}</h1>
                <p className='text-sm'>Welcome back! Please sign in to continue</p>

                {state === "Sign Up" && isTextDataSubmited
                    ? <>
                        <div className='flex items-center gap-4 my-10'>
                           <label htmlFor="image">
                            <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                            <input onChange={e=>setImage(e.target.files[0])} type="file" hidden id='image' />
                           </label> 
                           <p>Upload Company <br /> logo</p>
                        </div>

                    </>
                    : <>
                        {state !== 'Login' && (
                            <div className='border border-gray-300/70 px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                                <img src={assets.person_icon} alt="" />
                                <input className='outline-none text-sm' onChange={e => setName(e.target.value)} value={name} type="text" placeholder='Company Name' required />
                            </div>
                        )}

                        <div className='border border-gray-300/70 px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.email_icon} alt="" />
                            <input className='outline-none text-sm' onChange={e => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required />
                        </div>
                        <div className='border border-gray-300/70 px-4 py-2 flex items-center gap-2 rounded-full mt-5'>
                            <img src={assets.lock_icon} alt="" />
                            <input className='outline-none text-sm' onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required />
                        </div>
                    </>
                }

                {state === "Login" && <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot Password</p>}

                <button type='submit' className='bg-blue-600 w-full text-white py-2 rounded-full  mt-4'>
                    {state === 'Login' ? 'Login' : isTextDataSubmited ? 'Create Account' : 'Next'}
                </button>

                {state === 'Login'
                    ? <p className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Sign Up")}>Sign Up</span></p>
                    : <p className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer' onClick={() => setState("Login")}>Login</span></p>
                }

                <img onClick={e=>setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon} alt="" />
            </form>
        </div>
    )
}

export default RecruiterLogin
