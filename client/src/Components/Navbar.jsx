import React, { useContext } from 'react';
import {Link, NavLink, useNavigate} from 'react-router';
import { AuthContext } from '../Contexts/Authprovider.jsx';
import { toast } from 'react-toastify';
import ThemeContext from '../Contexts/ThemeContext.jsx';

const Navbar = () => {
    const { signOutUser, saveUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const links = (
        <>
            <li>
                <NavLink
                    className={({ isActive }) =>
                        `btn btn-ghost font-semibold text-base transition-colors ${
                            isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`
                    }
                    to="/"
                >
                    Home
                </NavLink>
            </li>
            {saveUser ? (
                <li>
                    <NavLink
                        className={({ isActive }) =>
                            `btn btn-ghost font-semibold text-base transition-colors ${
                                isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`
                        }
                        to="/allItems"
                    >
                        Lost & Found Items
                    </NavLink>
                </li>
            ) : (
                <>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `btn btn-ghost font-semibold text-base transition-colors ${
                                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`
                            }
                            to="/register"
                        >
                            Register
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            className={({ isActive }) =>
                                `btn btn-ghost font-semibold text-base transition-colors ${
                                    isActive ? 'bg-primary text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`
                            }
                            to="/login"
                        >
                            Login
                        </NavLink>
                    </li>
                </>
            )}
        </>
    );

    const clickSignOut = () => {
        signOutUser()
            .then(() => {
                navigate('/login');
                toast.success('Logged out successfully!', { autoClose: 2000 });
            })
            .catch((error) => {
                console.error('Sign out error:', error);
                toast.error('Logout failed!', { autoClose: 2000 });
            });
    };


    return (
        <div className="bg-base-100 shadow-lg">
            <div className="max-w-screen-2xl mx-auto navbar py-4">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-gray-200 dark:border-gray-700"
                        >
                            {links}
                        </ul>
                    </div>
                    <a
                        className="btn btn-ghost text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-500 hover:to-green-500 transition-all duration-300"
                        aria-label="FindMyStuff Home"
                    >
                        FindMyStuff
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 gap-2">{links}</ul>
                </div>
                <div className="navbar-end flex items-center gap-3">
                    <ThemeContext />
                    {saveUser && (
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar tooltip tooltip-bottom" data-tip={saveUser.displayName}>
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img
                                        alt=""
                                        src={saveUser?.photoURL}
                                    />
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-gray-200 dark:border-gray-700"
                            >
                                <li className="px-4 py-2 text-base font-semibold text-gray-900 dark:text-gray-100">
                                    {saveUser?.displayName}
                                </li>
                                <li><Link to="/addItems">Add Item</Link></li>
                                <li><Link to="/allRecovered">Recovered Items</Link></li>
                                <li><Link to="/myItems">My Items</Link></li>
                                <li>
                                    <button
                                        onClick={clickSignOut}
                                        className="btn btn-ghost text-base font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;