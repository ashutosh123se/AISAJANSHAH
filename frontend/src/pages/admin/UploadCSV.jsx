import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import Button from '../../components/ui/Button';
import Papa from 'papaparse';
import { apiFetch } from '../../utils/api';

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        alert('Please upload a CSV file.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "name,email,phone,workshop\nJane Doe,jane@example.com,+919876543210,Memory Workshop\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "student_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadResult(null);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const response = await apiFetch('/api/admin/bulk-upload', {
            method: 'POST',
            body: JSON.stringify({ students: results.data })
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Failed bulk upload');
          
          setUploadResult({
            success: true,
            totalProcessed: results.data.length,
            created: data.successful,
            failed: data.failed,
            errors: data.errors || []
          });
          setFile(null);
        } catch (error) {
          console.error(error);
          alert('Bulk upload failed: ' + error.message);
        } finally {
          setIsUploading(false);
        }
      }
    });
  };

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[var(--color-primary)] tracking-tight">Bulk Upload Students.</h2>
        <p className="text-[16px] font-sans text-[var(--color-text-secondary)] mt-2 leading-relaxed">
          Upload a CSV file from Sajan's workshops to create accounts in bulk. Welcome emails will be sent automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[var(--color-border)] rounded-2xl shadow-sm p-8">
            
            <div 
              className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer
                ${file ? 'border-emerald-500 bg-emerald-50' : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-bg)]'}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              
              {file ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 border border-emerald-200 shadow-sm">
                    <FileSpreadsheet className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">{file.name}</h3>
                  <p className="text-[14px] font-sans text-[var(--color-text-secondary)] mt-2">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  
                  <div className="flex gap-4 mt-8">
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="px-6 py-3 rounded-lg font-sans font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleUpload(); }} disabled={isUploading} className="btn-elegant px-8">
                      {isUploading ? 'Uploading...' : 'Upload & Process'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6 shadow-sm">
                    <UploadIcon className="w-10 h-10 text-[var(--color-text-hint)]" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Drag & Drop your CSV here</h3>
                  <p className="text-[14px] font-sans text-[var(--color-text-secondary)] mt-2 max-w-sm mx-auto leading-relaxed">
                    or click to browse from your computer. Make sure it follows the required format.
                  </p>
                  <button className="mt-8 px-8 py-3 rounded-lg border border-[var(--color-border)] font-sans font-bold text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors pointer-events-none">
                    Select File
                  </button>
                </>
              )}
            </div>

            {uploadResult && (
              <div className="mt-10 border-t border-[var(--color-border)] pt-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold text-[var(--color-primary)]">Upload Results</h3>
                  <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-widest">
                    Completed
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="bg-[var(--color-bg)] rounded-xl p-6 text-center border border-[var(--color-border)]">
                    <div className="text-4xl font-serif font-bold text-[var(--color-primary)] mb-2">{uploadResult.totalProcessed}</div>
                    <div className="text-[11px] font-sans font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Processed</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-6 text-center border border-emerald-100">
                    <div className="text-4xl font-serif font-bold text-emerald-600 mb-2">{uploadResult.created}</div>
                    <div className="text-[11px] font-sans font-bold text-emerald-700 uppercase tracking-widest">Created</div>
                  </div>
                  <div className="bg-red-50 rounded-xl p-6 text-center border border-red-100">
                    <div className="text-4xl font-serif font-bold text-red-600 mb-2">{uploadResult.failed}</div>
                    <div className="text-[11px] font-sans font-bold text-red-700 uppercase tracking-widest">Failed</div>
                  </div>
                </div>

                {uploadResult.errors?.length > 0 && (
                  <div>
                    <h4 className="text-[15px] font-sans font-bold text-red-600 mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" /> Error Log
                    </h4>
                    <div className="bg-white border border-red-100 rounded-xl overflow-hidden text-[14px] font-mono shadow-sm">
                      {uploadResult.errors.map((err, i) => (
                        <div key={i} className="flex p-4 border-b border-red-50 last:border-0 bg-red-50/50 items-center">
                          <span className="w-20 font-bold text-red-500">Row {err.row || i+1}</span>
                          <span className="w-48 text-[var(--color-primary)] truncate font-semibold">{err.email}</span>
                          <span className="text-red-600">{err.error || err.reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[var(--color-border)] rounded-2xl p-8 shadow-sm sticky top-8">
            <h3 className="text-lg font-serif font-bold text-[var(--color-primary)] mb-4">Required Format</h3>
            <p className="text-[14px] font-sans text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              Your CSV file must include a header row with exactly these column names:
            </p>
            
            <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-4 text-[13px] font-mono text-[var(--color-primary)] font-semibold mb-8 overflow-x-auto whitespace-nowrap shadow-inner">
              name, email, phone, workshop
            </div>

            <h4 className="text-[14px] font-sans font-bold text-[var(--color-primary)] mb-4">Column Details:</h4>
            <ul className="text-[14px] font-sans text-[var(--color-text-secondary)] space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-[var(--color-primary)]">name</strong> (Required): Full name of the student.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-[var(--color-primary)]">email</strong> (Required): Must be a valid, unique email address.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-text-hint)] shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-[var(--color-primary)]">phone</strong> (Optional): Including country code is recommended.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--color-text-hint)] shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong className="text-[var(--color-primary)]">workshop</strong> (Optional): Source of the student.</span>
              </li>
            </ul>
            
            <button onClick={handleDownloadTemplate} className="w-full mt-8 flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[var(--color-border)] font-sans font-bold text-[var(--color-primary)] hover:bg-[var(--color-bg)] transition-colors">
              <FileSpreadsheet className="w-4 h-4" /> Download Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
