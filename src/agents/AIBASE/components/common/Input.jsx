import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-maintext mb-1.5">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-4 py-2.5 bg-white border border-border rounded-xl text-maintext placeholder-subtext focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
