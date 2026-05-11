'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, profile, session, signOut } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Editable fields
  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [lastName, setLastName] = useState(profile?.last_name ?? '');
  const [position, setPosition] = useState(profile?.position ?? '');

  // Sync fields when editing starts
  const startEditing = () => {
    setFirstName(profile?.first_name ?? '');
    setLastName(profile?.last_name ?? '');
    setPosition(profile?.position ?? '');
    setIsEditing(true);
    setError('');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        position,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== 'DELETE') return;
    setIsDeleting(true);
    setError('');

    try {
      const isNative = typeof window !== 'undefined' && !!(window as any).Capacitor?.isNativePlatform?.();
      const deleteUrl = isNative
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/delete-account`
        : '/api/delete-account';

      const response = await fetch(deleteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete account');

      await signOut();
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account. Please contact support.');
      setIsDeleting(false);
    }
  };

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || 'Crew Member'
    : 'Crew Member';

  const initials = profile
    ? `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`.toUpperCase()
    : '?';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="page-container">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* ── Profile hero card ── */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {initials}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
                  <p className="text-sm text-gray-500">{profile?.position || 'Crew Member'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={signOut}
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Sign Out
              </button>
            </div>

            {/* Airline badge */}
            {profile?.airline_name && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <i className="ri-flight-takeoff-line text-blue-500 text-lg"></i>
                <div>
                  <div className="text-sm font-semibold text-blue-800">{profile.airline_name}</div>
                  <div className="text-xs text-blue-500">
                    {profile.airline_code} · Employee {profile.employee_id}
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    {profile.role?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Feedback messages ── */}
          {successMessage && (
            <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-2">
              <i className="ri-checkbox-circle-line"></i>
              <span>{successMessage}</span>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          {/* ── Profile information ── */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button onClick={startEditing} className="text-sm text-blue-600 font-medium">
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="input"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800">{profile?.first_name || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="input"
                    />
                  ) : (
                    <p className="text-sm font-medium text-gray-800">{profile?.last_name || '—'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Employee ID</label>
                  <p className="text-sm font-medium text-gray-800">{profile?.employee_id || '—'}</p>
                  <p className="text-[10px] text-gray-400">Contact admin to change</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Position</label>
                  {isEditing ? (
                    <select
                      value={position}
                      onChange={e => setPosition(e.target.value)}
                      className="input"
                    >
                      <option value="Flight Attendant">Flight Attendant</option>
                      <option value="Purser">Purser</option>
                      <option value="Senior Flight Attendant">Senior FA</option>
                      <option value="Galley Manager">Galley Manager</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium text-gray-800">{profile?.position || '—'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Email</label>
                <p className="text-sm font-medium text-gray-800">{user?.email}</p>
                <p className="text-[10px] text-gray-400">Managed via account settings</p>
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center gap-2">
                        <i className="ri-loader-4-line animate-spin"></i>Saving…
                      </span>
                    ) : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setError(''); }}
                    className="btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Danger zone ── */}
          <div className="card p-5 border-2 border-red-200">
            <h2 className="font-semibold text-red-600 mb-1">Danger Zone</h2>
            <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back.</p>
            <button onClick={() => setShowDeleteModal(true)} className="btn-danger">
              <i className="ri-delete-bin-line mr-2"></i>Delete Account
            </button>
          </div>

        </div>
      </div>

      {/* ── Delete modal ── */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title text-red-600">Delete Account</h2>
              <button onClick={() => setShowDeleteModal(false)} className="modal-close">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <i className="ri-error-warning-line text-red-600 text-xl mt-0.5"></i>
                  <div>
                    <h3 className="font-semibold text-red-900 mb-1">This action cannot be undone</h3>
                    <ul className="text-sm text-red-800 list-disc list-inside space-y-1">
                      <li>Your profile information</li>
                      <li>All inventory data</li>
                      <li>Issue reports</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-3 text-sm">
                Type <span className="font-mono font-bold">DELETE</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="input"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}
                className="btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                className="btn-danger"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>Deleting…
                  </span>
                ) : (
                  <><i className="ri-delete-bin-line mr-2"></i>Permanently Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
