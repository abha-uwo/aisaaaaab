import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, CheckCircle, ArrowLeft, AlertCircle, Pencil } from 'lucide-react';
import { AppRoute, apis } from '../types';
import { apiService } from '../services/apiService';
import axios from 'axios';
import { getUserData, setUserData } from '../userStore/userData';


export default function VerificationForm() {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // const [formData, setFormData] = useState({ email: Cookies.get("email"), })
    const email = getUserData("user").email
    const navigator = useNavigate()
    const handleVerify = async (e) => {
        e.preventDefault();
        axios.post(apis.emailVerificationApi, { code: verificationCode, email }).then((res) => {
            console.log(res);
            setUserData(res.data)
            navigator(AppRoute.DASHBOARD)

        }).catch((err) => {
            console.log(err);
            setError(err.message || 'Verification failed');

        }).finally(() => {

        })

    };
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-surface relative overflow-hidden">
            <div className="relative z-10 w-full max-w-md">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-block p-3 rounded-full bg-primary/10 mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-maintext mb-2">Verify Email</h2>
                    <p className="text-subtext ">
                        We've sent a code to <span className="font-medium text-maintext  ">{email}
                            <div className="inline-block p-1 rounded-full bg-primary/10 mb-2 cursor-pointer " onClick={() => { navigator(AppRoute.SIGNUP) }}>
                                <Pencil className="w-5 h-5 text-primary inline-block" />
                            </div></span>
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-border p-8 rounded-3xl shadow-xl">

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-maintext mb-2 text-center">
                                Enter Verification Code
                            </label>

                            <input
                                type="text"
                                maxLength={6}
                                required
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="000000"
                                className="w-full text-center text-3xl tracking-[0.5em] py-4 bg-surface border border-border rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent 
                           transition-all text-maintext font-mono placeholder:text-gray-300 placeholder:tracking-normal"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-primary rounded-xl font-bold text-white shadow-lg shadow-primary/25 
                         hover:shadow-primary/40 transform hover:scale-[1.02] transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                            {!loading && <CheckCircle className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-subtext">
                        Didn't receive code?{' '}
                        <button className="text-primary hover:underline font-medium">
                            Resend
                        </button>
                    </div>
                </div>

                {/* Back link */}
                <Link
                    to={AppRoute.SIGNUP}
                    className="mt-8 flex items-center justify-center gap-2 text-subtext hover:text-maintext transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Signup
                </Link>
            </div>
        </div>
    );
}