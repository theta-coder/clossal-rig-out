import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/profile');
    };

    return (
        <div className="container mx-auto px-4 py-24 min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md bg-white p-8 border border-gray-200 shadow-xl">
                <h1 className="text-3xl font-heading font-bold mb-6 text-center uppercase tracking-tight">Login</h1>
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Email Address</label>
                        <input type="email" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Password</label>
                        <input type="password" className="w-full border border-gray-300 p-3 focus:outline-none focus:border-black transition" placeholder="Enter your password" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center text-gray-500">
                            <input type="checkbox" className="mr-2" /> Remember me
                        </label>
                        <Link to="/forgot-password" className="text-black hover:underline uppercase tracking-widest font-semibold text-xs">Forgot Password?</Link>
                    </div>
                    <button type="submit" className="w-full bg-black text-white uppercase tracking-widest font-bold py-4 hover:bg-gray-800 transition">
                        Sign In
                    </button>
                </form>
                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-black font-bold uppercase tracking-widest hover:underline">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}
