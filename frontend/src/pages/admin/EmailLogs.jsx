import React, { useState } from 'react';
import { Search, Filter, Mail, CheckCircle2, XCircle } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { apiFetch } from '../../utils/api';

const EmailLogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await apiFetch('/api/admin/email-logs');

        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (error) {
        console.error('Error fetching email logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight">Email Delivery Logs.</h2>
        <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2">
          Monitor SendGrid email delivery statuses and troubleshoot issues.
        </p>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-8 border-b border-[var(--color-border)] flex flex-col sm:flex-row gap-4 justify-between items-center bg-[var(--color-bg)]">
          <div className="w-full sm:w-[400px] relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[var(--color-text-hint)]" />
            </div>
            <input 
              type="text"
              placeholder="Search by email or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-primary)] placeholder-[var(--color-text-hint)] focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] transition-all outline-none font-sans text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 h-12 px-6 rounded-lg border border-[var(--color-border)] bg-white text-[var(--color-primary)] font-sans font-semibold text-sm hover:bg-[var(--color-bg)] hover:text-[var(--color-primary)] transition-all w-full sm:w-auto">
              <Filter className="w-4 h-4" /> Filter Status
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-[var(--color-border)]">
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Recipient</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Subject</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[11px] font-sans font-bold text-[var(--color-text-hint)] uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-12 text-[var(--color-text-secondary)] font-sans">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-[var(--color-text-secondary)] font-sans">No logs found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)] transition-colors bg-white">
                    <td className="px-8 py-6 text-[14px] font-sans text-[var(--color-text-secondary)] whitespace-nowrap">
                      {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-8 py-6 text-[15px] font-sans font-bold text-[var(--color-primary)]">{log.to}</td>
                    <td className="px-8 py-6 text-[14px] font-sans text-[var(--color-text-secondary)] truncate max-w-[200px]">{log.subject || 'Welcome to AI Sajan Shah'}</td>
                    <td className="px-8 py-6">
                      <span className="text-[12px] font-sans font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full inline-block">
                        {log.type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {(() => {
                        const delivered =
                          log.status === 'success' ||
                          log.status === 'Delivered' ||
                          log.status === 'delivered' ||
                          log.status === 'sent';
                        const label = delivered ? 'Delivered' : 'Not Delivered';
                        return (
                          <div className={`flex items-center gap-2 text-[12px] font-sans font-bold px-3 py-1.5 rounded-full inline-flex ${
                            delivered
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-red-700 bg-red-50 border border-red-200'
                          }`}>
                            {delivered ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {label}
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmailLogs;
