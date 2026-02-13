'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabase';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

// Validation schema
const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').optional(),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').optional(),
  employee_id: z.string().min(3, 'Employee ID must be at least 3 characters').optional(),
  position: z.string().min(2, 'Position must be at least 2 characters').optional(),
  phone: z.string().optional(),
  emergency_contact: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  employee_id?: string;
  position?: string;
  phone?: string;
  emergency_contact?: string;
}

export default function Profile() {
  const { user: authUser, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Fetch user profile from database
  useEffect(() => {
    async function fetchProfile() {
      if (!authUser) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          // Pre-fill form with database values
          profileForm.reset({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            employee_id: data.employee_id || '',
            position: data.position || '',
            phone: data.phone || '',
            emergency_contact: data.emergency_contact || '',
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [authUser, profileForm]);

  const onProfileUpdate = async (data: ProfileFormData) => {
    if (!authUser) return;

    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          employee_id: data.employee_id,
          position: data.position,
          phone: data.phone,
          emergency_contact: data.emergency_contact,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id);

      if (error) throw error;

      // Update local state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin mb-2"></i>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="page-container">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="card-padded section-spacing">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="icon-circle icon-xl bg-blue-100">
                  <i className="ri-user-line text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.first_name || profile?.last_name 
                      ? `${profile?.first_name || ''} ${profile?.last_name || ''}`
                      : 'User'}
                  </h1>
                  <p className="text-gray-600">{profile?.position || 'Crew Member'}</p>
                  <p className="text-sm text-gray-500">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center space-x-2">
              <i className="ri-checkbox-circle-line"></i>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
              <i className="ri-error-warning-line"></i>
              <span>{error}</span>
            </div>
          )}

          {/* Profile Form */}
          <div className="card-padded section-spacing">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={profileForm.handleSubmit(onProfileUpdate)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    {...profileForm.register('first_name')}
                    type="text"
                    id="first_name"
                    disabled={!isEditing}
                    className={`input ${!isEditing ? 'input-disabled' : ''}`}
                  />
                  {profileForm.formState.errors.first_name && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.first_name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    {...profileForm.register('last_name')}
                    type="text"
                    id="last_name"
                    disabled={!isEditing}
                    className={`input ${!isEditing ? 'input-disabled' : ''}`}
                  />
                  {profileForm.formState.errors.last_name && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    {...profileForm.register('employee_id')}
                    type="text"
                    id="employee_id"
                    disabled={!isEditing}
                    className={`input ${!isEditing ? 'input-disabled' : ''}`}
                  />
                  {profileForm.formState.errors.employee_id && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.employee_id.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                    Position
                  </label>
                  <input
                    {...profileForm.register('position')}
                    type="text"
                    id="position"
                    disabled={!isEditing}
                    className={`input ${!isEditing ? 'input-disabled' : ''}`}
                  />
                  {profileForm.formState.errors.position && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.position.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  {...profileForm.register('phone')}
                  type="tel"
                  id="phone"
                  disabled={!isEditing}
                  placeholder="+1 (555) 123-4567"
                  className={`input ${!isEditing ? 'input-disabled' : ''}`}
                />
              </div>

              <div>
                <label htmlFor="emergency_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  {...profileForm.register('emergency_contact')}
                  type="text"
                  id="emergency_contact"
                  disabled={!isEditing}
                  placeholder="Name and phone number"
                  className={`input ${!isEditing ? 'input-disabled' : ''}`}
                />
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary"
                  >
                    {saving ? (
                      <span className="flex items-center justify-center space-x-2">
                        <i className="ri-loader-4-line animate-spin"></i>
                        <span>Saving...</span>
                      </span>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      profileForm.reset();
                      setError('');
                    }}
                    className="btn-secondary"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Settings */}
          <div className="card-padded">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 card">
                <div className="flex items-center space-x-3">
                  <div className="icon-circle icon-md bg-blue-100">
                    <i className="ri-mail-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email Address</h3>
                    <p className="text-sm text-gray-600">{profile?.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 card">
                <div className="flex items-center space-x-3">
                  <div className="icon-circle icon-md bg-green-100">
                    <i className="ri-lock-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Manage your password</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}