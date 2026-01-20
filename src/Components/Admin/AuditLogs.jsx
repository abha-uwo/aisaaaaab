import React from 'react';
import { FileText, Search } from 'lucide-react';

const AuditLogs = () => {
    const logs = [
        { id: 1, action: "Vendor_Approved", user: "Admin_Sarah", target: "TechSolutions", time: "10:45 AM" },
        { id: 2, action: "System_Config_Change", user: "SuperAdmin_Bhoom", target: "Global_Throttling", time: "09:12 AM" },
        { id: 3, action: "Refund_Processed", user: "Support_Bot", target: "Order_#992", time: "Yesterday" },
        { id: 4, action: "Agent_Rejected", user: "Admin_Sarah", target: "SpamBot_v1", time: "Yesterday" },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-maintext">Audit Logs</h2>

            <div className="bg-card border border-border rounded-xl p-4 flex gap-2">
                <Search className="w-5 h-5 text-subtext" />
                <input type="text" placeholder="Search logs by user, action, or target..." className="bg-transparent outline-none flex-1 text-maintext placeholder:text-subtext" />
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary border-b border-border text-subtext">
                        <tr>
                            <th className="px-5 py-3 font-medium">Action</th>
                            <th className="px-5 py-3 font-medium">User</th>
                            <th className="px-5 py-3 font-medium">Target</th>
                            <th className="px-5 py-3 font-medium text-right">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-secondary font-mono text-xs cursor-pointer transition-colors">
                                <td className="px-5 py-3 text-primary">{log.action}</td>
                                <td className="px-5 py-3 text-maintext">{log.user}</td>
                                <td className="px-5 py-3 text-subtext">{log.target}</td>
                                <td className="px-5 py-3 text-right text-subtext">{log.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AuditLogs;
