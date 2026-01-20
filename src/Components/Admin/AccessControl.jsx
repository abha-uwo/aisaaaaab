import React from 'react';
import { Shield, Lock, Users } from 'lucide-react';

const AccessControl = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-maintext">Roles & Permissions</h2>

            <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex gap-3 text-orange-600 dark:text-orange-400">
                <Lock className="w-5 h-5 shrink-0" />
                <p className="text-sm">You are logged in as <strong>Super Admin</strong>. You have full read/write access to all resources.</p>
            </div>

            <div className="space-y-4">
                {[
                    { role: 'Vendor', users: 84, desc: 'Limited access to their own agents and analytics.' },
                ].map((role) => (
                    <div key={role.role} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-maintext">{role.role}</h3>
                                <p className="text-sm text-subtext">{role.desc}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-maintext">{role.users}</span>
                            <p className="text-xs text-subtext uppercase">Users</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AccessControl;
