import React, { useEffect, useState } from 'react';
import './STYLES/App.css';
import Spline from '@splinetool/react-spline';

import eyeIcon from './IMG/visibility_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg'; 
import eyeOffIcon from './IMG/visibility_off_24dp_C7D2D6_FILL0_wght400_GRAD0_opsz24.svg'; 
import google from './IMG/flat-color-icons_google.svg'; 
import facebook from './IMG/bi_facebook.svg'; 
import github from './IMG/akar-icons_github-fill.svg'; 

function App() {
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
                event.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        // Limpia el evento al desmontar el componente
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <header>
                <Spline scene="https://prod.spline.design/BedHsbQnoGzxGCVf/scene.splinecode" />
            </header>
            <nav>
                <div>
                    <h1>Welcome to WIB</h1>
                    <h2>Login</h2>
                </div>
                <form>
                    <div>
                        <label htmlFor='email'>
                            <span>Email</span>
                            <div>
                                <input id='email' type='email' placeholder='username@gmail.com' />
                            </div>
                        </label>
                        <label htmlFor='password'>
                            <span>Password</span>
                            <div>
                                <input 
                                    id='password' 
                                    type={showPassword ? 'text' : 'password'} 
                                    placeholder='Password' 
                                />
                                <div className='hiddenIcons' id='hiddenIcons' onClick={togglePasswordVisibility}>
                                    <div>
                                        <img 
                                            src={showPassword ? eyeOffIcon : eyeIcon} 
                                            alt={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div>
                        <div id='forgotPassword' className='forgotPassword'>
                            {/* Aquí puedes añadir contenido si es necesario */}
                        </div>
                        <a href="#">Forgot Password?</a>
                    </div>
                    <button type="submit">Sign in</button>
                </form>
                <p>Or continue with</p>
                <div>
                    <a href=''>
                        <img src={google} alt="Option 1" />
                    </a>
                    <a href=''>
                        <img src={facebook} alt="Option 2" />
                    </a>
                    <a href=''>
                        <img src={github} alt="Option 3" />
                    </a>
                </div>
                <p>Don't have an account yet? <span>Register for free</span></p>
            </nav>
        </div>
    );
}

export default App;
