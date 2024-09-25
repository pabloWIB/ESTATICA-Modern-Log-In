import React, { useEffect } from 'react';
import './App.css';
import Spline from '@splinetool/react-spline';

function App() {
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

    return (
        <div>
            <header>
                <Spline scene="https://prod.spline.design/BedHsbQnoGzxGCVf/scene.splinecode" />
            </header>
            <nav>
                <h1>Welcome to WIB</h1>
                <form>
                    <h2>Login</h2>
                    <label htmlFor='email'>Email</label>
                    <input id='email' type='email' placeholder='username@gmail.com' />
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' placeholder='Password' />
                    <a href="#">Forgot Password?</a>
                    <button type="submit">Sign in</button>

                    <p>Or continue with</p>
                    <div>
                        <div>
                            <img alt="Option 1" />
                        </div>
                        <div>
                            <img alt="Option 2" />
                        </div>
                        <div>
                            <img alt="Option 3" />
                        </div>
                    </div>
                    <p>Don't have an account yet? <span>Register for free</span></p>
                </form>
            </nav>
        </div>
    );
}

export default App;
