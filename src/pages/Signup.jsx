import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== passwordConfirm) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        const response = await signup({
            name,
            email,
            password,
            password_confirmation: passwordConfirm,
            phone
        });

        if (response.success) {
            navigate('/profile');
        } else {
            setError(response.message);
        }
        setLoading(false);
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-10 border border-gray-100 shadow-2xl rounded-xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-heading font-black tracking-tight text-gray-900 uppercase">Sign Up</h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">Join Urban Threads Today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 mb-6 rounded-lg text-sm border border-red-100 flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSignup}>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Full Name</label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Email Address</label>
                        <input
                            type="email"
                            className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                            placeholder="+1 (555) 000-0000"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Password</label>
                            <input
                                type="password"
                                className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1.5">Confirm</label>
                            <input
                                type="password"
                                className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                                placeholder="••••••••"
                                value={passwordConfirm}
                                onChange={(e) => setPasswordConfirm(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white mt-4 uppercase tracking-widest text-sm font-bold py-4 rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 flex justify-center items-center"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm font-medium text-gray-500 border-t border-gray-100 pt-6">
                    Already have an account? <Link to="/login" className="text-black font-bold uppercase tracking-widest hover:underline ml-1">Log In</Link>
                </div>
            </div>
        </div>
    );
}
