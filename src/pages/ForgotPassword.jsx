import React, { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Mail, Loader } from 'lucide-react';
import axios from 'axios';
import { apis } from '../types';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            // ideally use env var for API URL
            const response = await axios.post(apis.forgotPassword, { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 bg-surface">
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white border border-border p-8 rounded-3xl shadow-xl">
                    <Link to="/login" className="inline-flex items-center text-subtext hover:text-maintext mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-maintext mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-subtext">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {message && (
                        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm text-center">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-maintext mb-2 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-subtext" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-surface border border-border rounded-xl py-3 pl-12 pr-4 text-maintext placeholder-subtext focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary rounded-xl font-bold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin mr-2" />
                                    Sending Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default ForgotPassword;
