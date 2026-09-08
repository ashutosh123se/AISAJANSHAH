import React, { useState } from 'react';
import { Lock, KeyRound, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.newPassword) {
      setError('Please enter a new password');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiFetch('/api/student/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess('Password updated successfully! Use your new password for your next login.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[var(--color-border)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[var(--color-accent)]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Change Password</h3>
              <p className="text-xs font-sans text-[var(--color-text-secondary)]">Secure your student account</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-sans font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none font-sans text-sm text-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              placeholder="Min 6 characters"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none font-sans text-sm text-[var(--color-primary)]"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-transparent focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] outline-none font-sans text-sm text-[var(--color-primary)]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-sans font-semibold text-[var(--color-text-secondary)] hover:bg-[var(--color-bg)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-elegant px-6 py-2.5 text-sm flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
