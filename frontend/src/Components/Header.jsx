import React, { useState, useEffect } from 'react';
import { User, Bell, LogIn, UserPlus } from 'lucide-react';
import Chatbot from './Chatbot';
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';

function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // Use useEffect to check login status and set user data when component mounts
    useEffect(() => {
        const loggedIn = Cookies.get('isLoggedIn');
        const username = Cookies.get('name');
        setUser(username);

        if (loggedIn) {
            setIsLoggedIn(true);
        }
    }, []);  // Empty dependency array means this only runs on mount

    return (
        <div className='flex justify-between items-center bg-[#eef5f5cb] text-[#563393] p-4 shadow-md shadow-blue-200 border-b-2 border-blue-600'>
            {/* Left - Logo Section */}
            <div className='flex items-center space-x-4 drop-shadow-xl '>
                <img
                    src="../public/image.png"
                    alt="LOGO"
                    className='w-16 h-16 object-contain'
                />
                <h1 className='text-xl font-bold'>CareSpaceX</h1>
            </div>

            {/* Right - Auth Section */}
            <div>
                {isLoggedIn ? (
                    <div className='flex items-center space-x-3'>
                        {/* Hide notification and profile on mobile */}
                        <div className='hidden md:flex items-center space-x-3'>
                            {/* Notification Icon */}
                            {/* <div className='cursor-pointer hover:bg-purple-100 p-2 rounded-full relative'>
                                <Bell className='w-6 h-6' />
                                <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                                    3
                                </span>
                            </div> */}

                            {/* Profile */}
                            {user ? (
                                <div className='flex items-center space-x-2'>
                                    {user.profilePhoto ? (
                                        <img
                                            src={user.profilePhoto}
                                            alt="Profile"
                                            className='w-10 h-10 rounded-full object-cover'
                                        />
                                    ) : (
                                        <div className='bg-purple-200 text-[#563393] rounded-full w-10 h-10 flex items-center justify-center'>
                                            <User className='w-6 h-6 text-red-500' />
                                        </div>
                                    )}
                                    <span className='font-medium text-black'>{user}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className='flex space-x-4'>
                        <Link to="/login">
                            <button className='flex items-center bg-transparent border border-[#563393] text-[#563393] px-4 py-2 rounded-md hover:bg-purple-50'>
                                <LogIn className='mr-2 w-5 h-5' />
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className='flex items-center bg-[#563393] text-white px-4 py-2 rounded-md hover:bg-purple-700'>
                                <UserPlus className='mr-2 w-5 h-5' />
                                Sign Up
                            </button>
                        </Link>
                    </div>

                )}
            </div>
        </div>
    );
}

export default Header;