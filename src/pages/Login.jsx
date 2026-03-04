import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const from = location.state?.from?.pathname || "/profile";

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const response = await login(email, password);

        if (response.success) {
            navigate(from, { replace: true });
        } else {
            setError(response.message);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-10 border border-gray-100 shadow-2xl rounded-xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading font-black tracking-tight text-gray-900 uppercase">Login</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Welcome back to Urban Threads</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg text-sm border border-red-100 flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full border border-gray-200 bg-gray-50 p-4 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" className="text-gray-500 hover:text-black hover:underline uppercase tracking-widest font-bold text-[10px] transition-colors">Forgot?</Link>
                        </div>
                        <input
                            type="password"
                            className="w-full border border-gray-200 bg-gray-50 p-4 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white uppercase tracking-widest text-sm font-bold py-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-gray-500 border-t border-gray-100 pt-6">
                    Don't have an account? <Link to="/signup" className="text-black font-bold uppercase tracking-widest hover:underline ml-1">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
