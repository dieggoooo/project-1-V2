'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

// Validation schemas
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  employeeId: z.string().min(3, 'Employee ID must be at least 3 characters'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  phone: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  position: string;
  phone?: string;
  emergencyContact?: string;
}

export default function Profile() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const onSignIn = (data: SignInFormData) => {
    // Simulate authentication
    const mockUser: User = {
      id: '1',
      email: data.email,
      firstName: 'John',
      lastName: 'Doe',
      employeeId: 'EMP001',
      position: 'Flight Attendant',
      phone: '+1 (555) 123-4567',
      emergencyContact: 'Jane Doe +1 (555) 987-6543',
    };
    
    setUser(mockUser);
    setIsSignedIn(true);
    
    // Pre-fill profile form with user data
    profileForm.reset({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      employeeId: mockUser.employeeId,
      position: mockUser.position,
      phone: mockUser.phone,
      emergencyContact: mockUser.emergencyContact,
    });
  };

  const onProfileUpdate = (data: ProfileFormData) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setUser(null);
    setIsEditing(false);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="pb-20 px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3.5rem)' }}>
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-user-line text-blue-600 text-2xl"></i>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
                <p className="text-gray-600 mt-2">Access your crew profile</p>
              </div>

              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-mail-line text-gray-400"></i>
                    </div>
                    <input
                      {...signInForm.register('email')}
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {signInForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="ri-lock-line text-gray-400"></i>
                    </div>
                    <input
                      {...signInForm.register('password')}
                      type="password"
                      id="password"
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {signInForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Demo: Use any valid email and password (6+ characters)
                </p>
              </div>
            </div>
          </div>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pb-20 px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 3.5rem)' }}>
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-600">{user?.position}</p>
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

          {/* Profile Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
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
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    {...profileForm.register('firstName')}
                    type="text"
                    id="firstName"
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    {...profileForm.register('lastName')}
                    type="text"
                    id="lastName"
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    {...profileForm.register('employeeId')}
                    type="text"
                    id="employeeId"
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  />
                  {profileForm.formState.errors.employeeId && (
                    <p className="text-red-500 text-sm mt-1">{profileForm.formState.errors.employeeId.message}</p>
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  {...profileForm.register('emergencyContact')}
                  type="text"
                  id="emergencyContact"
                  disabled={!isEditing}
                  placeholder="Name and phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {isEditing && (
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      profileForm.reset();
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-mail-line text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email Address</h3>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="ri-lock-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Password</h3>
                    <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="ri-notification-line text-purple-600"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">Manage your preferences</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Configure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}