import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Lock, Save } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Toast, { ToastContainer } from '../../components/ui/Toast';
import { apiFetch } from '../../utils/api';

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workshop: 'Memory Workshop',
    password: '',
    sendEmail: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await apiFetch('/api/admin/students', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to add student');
      }
      
      const emailNote =
        data.emailStatus === 'sent'
          ? ' Welcome email delivered.'
          : data.emailStatus === 'not_delivered' || data.emailStatus === 'failed' || data.emailStatus === 'simulated'
            ? ` Welcome email not delivered — share this password with the student: ${formData.password}`
            : data.emailStatus === 'skipped'
              ? ` Share this password with the student: ${formData.password}`
              : ` Password: ${formData.password}`;
      addToast(`Student added successfully!${emailNote}`, 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        workshop: 'Memory Workshop',
        password: '',
        sendEmail: true
      });
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  return (
    <div className="p-8 lg:p-12 max-w-4xl mx-auto w-full">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div className="mb-10">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight">Add New Student.</h2>
        <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2">
          Create a new account manually. They will receive an email with their credentials.
        </p>
      </div>

      <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Rahul Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />

            <div>
              <label className="block text-xs font-sans font-bold text-[var(--color-text-secondary)] mb-2 uppercase tracking-widest">
                Workshop / Origin
              </label>
              <select
                name="workshop"
                value={formData.workshop}
                onChange={handleChange}
                className="w-full bg-white border border-[var(--color-border)] rounded-lg py-3 px-4 text-[15px] text-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all duration-200"
              >
                <option value="Memory Workshop">Memory Workshop</option>
                <option value="Goal Setting Mastery">Goal Setting Mastery</option>
                <option value="Public Speaking">Public Speaking</option>
                <option value="Student Excellence">Student Excellence</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-8 mt-2">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Authentication</h3>
                <p className="text-[14px] font-sans text-[var(--color-text-secondary)] mt-1">Set an initial password for the student.</p>
              </div>
              <button 
                type="button" 
                onClick={generatePassword}
                className="text-[14px] font-sans font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-2"
              >
                <Lock className="w-4 h-4" /> Generate Random
              </button>
            </div>
            
            <div className="max-w-md">
              <Input
                name="password"
                type="text"
                placeholder="Initial password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 mt-4">
            <input 
              type="checkbox" 
              name="sendEmail"
              id="sendEmail"
              checked={formData.sendEmail}
              onChange={handleChange}
              className="mt-1 w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]" 
            />
            <div>
              <label htmlFor="sendEmail" className="text-[15px] font-sans font-bold text-[var(--color-primary)] cursor-pointer">
                Send Welcome Email
              </label>
              <p className="text-[14px] font-sans text-[var(--color-text-secondary)] mt-1 leading-relaxed">
                This will automatically send an email via SendGrid to the student containing their login credentials and a link to the portal.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-[var(--color-border)]">
            <button type="button" onClick={() => window.history.back()} className="px-6 py-3 rounded-lg font-sans font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-elegant px-8 flex items-center gap-2">
              {isSubmitting ? 'Creating...' : <><Save className="w-4 h-4" /> Create Account</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
