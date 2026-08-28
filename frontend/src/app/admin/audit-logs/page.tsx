"use client";

import { useState } from "react";
import { FileText, Search, Filter, Clock, User, Shield, Settings, AlertTriangle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { formatDate } from "@/lib/utils";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_role: string;
  action_type: string;
  resource_type: string;
  resource_id: string;
  description: string;
  ip_address: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
}

const SEVERITY_COLORS: Record<string, string> = {
  INFO: "bg-blue-50 text-blue-700 border-blue-200",
  WARNING: "bg-amber-50 text-amber-700 border-amber-200",
  CRITICAL: "bg-rose-50 text-rose-700 border-rose-200",
};

const ACTION_ICONS: Record<string, typeof User> = {
  USER_ACTION: User,
  ADMIN_ACTION: Shield,
  SYSTEM_ACTION: Settings,
  SECURITY_EVENT: AlertTriangle,
};

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterActionType, setFilterActionType] = useState("all");

  const logs: AuditLogEntry[] = [
    { id: "1", timestamp: "2024-08-27T12:30:15Z", actor_name: "admin@marketsphere.com", actor_role: "ADMIN", action_type: "ADMIN_ACTION", resource_type: "Vendor", resource_id: "v-apex-001", description: "Approved vendor application for Apex Electronics", ip_address: "192.168.1.100", severity: "INFO" },
    { id: "2", timestamp: "2024-08-27T12:15:42Z", actor_name: "seller.apex@example.com", actor_role: "SELLER", action_type: "USER_ACTION", resource_type: "Product", resource_id: "p-qnt-anc", description: "Updated product pricing for Quantum ANC Pro Headphones", ip_address: "10.0.0.55", severity: "INFO" },
    { id: "3", timestamp: "2024-08-27T11:45:03Z", actor_name: "system", actor_role: "SYSTEM", action_type: "SECURITY_EVENT", resource_type: "Auth", resource_id: "sess-8472", description: "Multiple failed login attempts detected for customer@example.com (5 attempts in 2 minutes)", ip_address: "203.0.113.42", severity: "WARNING" },
    { id: "4", timestamp: "2024-08-27T11:20:18Z", actor_name: "admin@marketsphere.com", actor_role: "ADMIN", action_type: "ADMIN_ACTION", resource_type: "Promotion", resource_id: "promo-bogo-yoga", description: "Suspended promotion 'BOGO Yoga Mats' due to fraud flag", ip_address: "192.168.1.100", severity: "WARNING" },
    { id: "5", timestamp: "2024-08-27T10:55:30Z", actor_name: "system", actor_role: "SYSTEM", action_type: "SYSTEM_ACTION", resource_type: "Database", resource_id: "db-primary", description: "Automated database backup completed successfully (2.4 GB)", ip_address: "127.0.0.1", severity: "INFO" },
    { id: "6", timestamp: "2024-08-27T10:30:00Z", actor_name: "admin@marketsphere.com", actor_role: "ADMIN", action_type: "ADMIN_ACTION", resource_type: "User", resource_id: "u-mal-001", description: "Permanently banned user account for Terms of Service violation", ip_address: "192.168.1.100", severity: "CRITICAL" },
    { id: "7", timestamp: "2024-08-27T09:45:12Z", actor_name: "customer@example.com", actor_role: "CUSTOMER", action_type: "USER_ACTION", resource_type: "Order", resource_id: "ord-2024-0895", description: "Placed order with 3 items totaling $456.99", ip_address: "172.16.0.88", severity: "INFO" },
    { id: "8", timestamp: "2024-08-27T09:00:00Z", actor_name: "system", actor_role: "SYSTEM", action_type: "SECURITY_EVENT", resource_type: "API", resource_id: "api-v1", description: "Rate limit exceeded for API key ak_test_xxxx from IP 203.0.113.99", ip_address: "203.0.113.99", severity: "CRITICAL" },
  ];

  const filtered = logs.filter((log) => {
    if (filterSeverity !== "all" && log.severity !== filterSeverity) return false;
    if (filterActionType !== "all" && log.action_type !== filterActionType) return false;
    if (searchQuery && !log.description.toLowerCase().includes(searchQuery.toLowerCase()) && !log.actor_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Audit Logs</h1>
          <p className="text-xs text-gray-500 mt-1">Complete chronological record of all platform actions, security events, and system operations.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search logs..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-white outline-none">
            <option value="all">All Severities</option>
            <option value="INFO">Info</option>
            <option value="WARNING">Warning</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <select value={filterActionType} onChange={(e) => setFilterActionType(e.target.value)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold bg-white outline-none">
            <option value="all">All Types</option>
            <option value="USER_ACTION">User Action</option>
            <option value="ADMIN_ACTION">Admin Action</option>
            <option value="SYSTEM_ACTION">System Action</option>
            <option value="SECURITY_EVENT">Security Event</option>
          </select>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-400 uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Resource</th>
                  <th className="p-4">IP</th>
                  <th className="p-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((log) => {
                  const ActionIcon = ACTION_ICONS[log.action_type] || FileText;
                  return (
                    <tr key={log.id} className={`hover:bg-slate-50/50 transition-colors ${log.severity === "CRITICAL" ? "bg-rose-50/20" : ""}`}>
                      <td className="p-4 font-mono text-gray-500 whitespace-nowrap">{formatDate(log.timestamp)}</td>
                      <td className="p-4">
                        <p className="font-bold text-gray-900 text-[11px]">{log.actor_name}</p>
                        <p className="text-[10px] text-gray-400">{log.actor_role}</p>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-gray-600">
                          <ActionIcon className="w-3 h-3" /> {log.action_type.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4 text-gray-700 max-w-xs truncate">{log.description}</td>
                      <td className="p-4 font-mono text-gray-500">{log.resource_type}/{log.resource_id}</td>
                      <td className="p-4 font-mono text-gray-400">{log.ip_address}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 font-bold rounded-full border text-[10px] ${SEVERITY_COLORS[log.severity]}`}>{log.severity}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
