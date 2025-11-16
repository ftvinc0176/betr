'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    socialSecurityNumber: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // For phone number, only allow digits and max 10 characters
    if (name === 'phoneNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } 
    // For SSN, only allow digits and max 9 characters
    else if (name === 'socialSecurityNumber') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 9);
      setFormData(prev => ({ ...prev, [name]: digitsOnly }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => {
    setError('');
    
    switch(step) {
      case 1:
        if (!formData.email.trim()) {
          setError('Please enter your email');
          return;
        }
        break;
      case 2:
        if (!formData.password.trim()) {
          setError('Please enter a password');
          return;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }
        break;
      case 3:
        if (!formData.fullName.trim()) {
          setError('Please enter your full name');
          return;
        }
        break;
      case 4:
        if (!formData.dateOfBirth) {
          setError('Please enter your date of birth');
          return;
        }
        break;
      case 5:
        if (!formData.street.trim() || !formData.city.trim() || !formData.state.trim() || !formData.zip.trim()) {
          setError('Please fill in all address fields');
          return;
        }
        break;
      case 6:
        if (!formData.phoneNumber.trim()) {
          setError('Please enter your phone number');
          return;
        }
        if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
          setError('Phone number must be exactly 10 digits');
          return;
        }
        break;
      case 7:
        if (!formData.socialSecurityNumber.trim()) {
          setError('Please enter your social security number');
          return;
        }
        if (!/^\d{9}$/.test(formData.socialSecurityNumber.trim())) {
          setError('Social security number must be exactly 9 digits');
          return;
        }
        break;
      case 8:
        if (!formData.confirmPassword.trim()) {
          setError('Please confirm your password');
          return;
        }
        console.log('Password:', JSON.stringify(formData.password));
        console.log('Confirm Password:', JSON.stringify(formData.confirmPassword));
        if (formData.confirmPassword.trim() !== formData.password.trim()) {
          setError('Passwords do not match');
          return;
        }
        break;
    }
    
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('=== HANDLE SUBMIT CALLED ===');
    console.log('Form Data:', formData);
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Don't send confirmPassword to API since we already validated it
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...dataToSend } = formData;
      
      const payload = {
        fullName: dataToSend.fullName,
        dateOfBirth: dataToSend.dateOfBirth,
        socialSecurityNumber: dataToSend.socialSecurityNumber,
        address: `${dataToSend.street}, ${dataToSend.city}, ${dataToSend.state} ${dataToSend.zip}`,
        email: dataToSend.email,
        phoneNumber: dataToSend.phoneNumber,
        password: dataToSend.password
      };

      console.log('Sending payload:', payload);
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        const userId = data.user.id || data.user._id;
        console.log('Registration successful, userId:', userId);
        if (!userId) {
          setError('Failed to get user ID');
          setLoading(false);
          return;
        }
        setSuccess('Registration successful! Redirecting to verification...');
        setTimeout(() => {
          window.location.href = `/verify-id?userId=${encodeURIComponent(userId)}`;
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
    { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
    { label: 'Full Name', key: 'fullName', type: 'text', placeholder: 'John Doe' },
    { label: 'Date of Birth', key: 'dateOfBirth', type: 'date', placeholder: '' },
    { label: 'Address', key: 'address', type: 'address', placeholder: 'Address' },
    { label: 'Phone Number', key: 'phoneNumber', type: 'tel', placeholder: '1234567890' },
    { label: 'Social Security Number', key: 'socialSecurityNumber', type: 'password', placeholder: '•••••••••' },
    { label: 'Confirm Password', key: 'confirmPassword', type: 'password', placeholder: '••••••••' }
  ];

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/30 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-purple-800/20 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-3xl opacity-15"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header with logo */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600">
              Betr
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Create your account in just {steps.length} steps</p>
        </div>

        <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-10 border border-purple-500/20 shadow-2xl shadow-purple-600/10">
          {/* Progress indicator */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              {steps.map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      idx + 1 <= step
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg shadow-purple-500/50'
                        : 'bg-gray-800 border border-gray-700'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-500 ${
                        idx + 1 < step
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                          : 'bg-gray-800'
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm">Step {step} of {steps.length}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/50 text-red-200 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-top">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/50 text-green-200 text-sm backdrop-blur-sm animate-in fade-in slide-in-from-top">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {step <= steps.length ? (
              <>
                <div className="animate-in fade-in slide-in-from-right duration-500">
                  {currentStepData.key === 'address' ? (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-white font-bold mb-3 text-lg">Street Address</label>
                        <input
                          type="text"
                          name="street"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="123 Main St"
                          className="w-full px-5 py-4 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-base"
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white font-bold mb-3 text-sm">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-white font-bold mb-3 text-sm">State</label>
                          <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-white font-bold mb-3 text-sm">Zip Code</label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          placeholder="10001"
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <label className="block text-white font-bold mb-4 text-lg">{currentStepData.label}</label>
                      <input
                        type={currentStepData.type}
                        name={currentStepData.key}
                        value={formData[currentStepData.key as keyof typeof formData]}
                        onChange={handleChange}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                        placeholder={currentStepData.placeholder}
                        className="w-full px-5 py-4 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:bg-white/10 focus:shadow-lg focus:shadow-purple-500/20 transition-all duration-300 text-base"
                        autoFocus
                      />
                    </>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 py-3 px-4 rounded-xl border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 font-bold text-white hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-bold text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="animate-in fade-in slide-in-from-right duration-500">
                  <h2 className="text-2xl font-bold text-white mb-6">Confirm Your Information</h2>
                  <div className="bg-linear-to-br from-purple-500/10 to-purple-600/10 rounded-2xl p-6 border border-purple-500/30 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
                      <span className="text-gray-400">Full Name</span>
                      <span className="text-white font-semibold">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
                      <span className="text-gray-400">Date of Birth</span>
                      <span className="text-white font-semibold">{formData.dateOfBirth}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
                      <span className="text-gray-400">Address</span>
                      <span className="text-white font-semibold text-right">{formData.street}, {formData.city}, {formData.state} {formData.zip}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-purple-500/20">
                      <span className="text-gray-400">Email</span>
                      <span className="text-white font-semibold">{formData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Phone</span>
                      <span className="text-white font-semibold">{formData.phoneNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-purple-500/50 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-300 font-bold text-white hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all duration-300 font-bold text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105 active:scale-95"
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>

          {/* Login link */}
          <p className="text-center text-gray-400 mt-8 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-16 text-gray-400 text-xs space-y-6">
          {/* Copyright */}
          <div className="text-center">
            <p className="font-semibold text-gray-300">© Betr 2025. All Rights Reserved, Miami, FL</p>
          </div>

          {/* Problem Gambling Help */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/10">
            <h3 className="font-semibold text-purple-400 mb-3">If you need help:</h3>
            <p className="leading-relaxed mb-3">
              The National Council on Problem Gambling operates the National Problem Gambling Helpline Network (1-800-522-4700). The network is a single national access point to local resources for those seeking help for a gambling problem. The network consists of 28 call centers which provide resources and referrals for all 50 states, Canada and the US Virgin Islands. Help is available 24/7 and is 100% confidential.
            </p>
            <p className="leading-relaxed mb-3">
              The National Problem Gambling Helpline Network also includes text and chat services. These features enable those who are gambling online or on their mobile phone to access help the same way they play. One call, text, or chat will get you to problem gambling help anywhere in the U.S. 24/7/365.
            </p>
            <p>
              You can also visit National Problem Gambling Helpline Network here:{' '}
              <a 
                href="https://www.ncpgambling.org/help-treatment/help-by-state/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline transition-colors"
              >
                https://www.ncpgambling.org/help-treatment/help-by-state/
              </a>
            </p>
          </div>

          {/* Age Requirement */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/10">
            <h3 className="font-semibold text-purple-400 mb-3">Age requirement:</h3>
            <p className="leading-relaxed">
              Betr understands that preventing underage gambling is vital and we take that responsibility seriously. You must be 18 years of age or older in order to open an account and play Betr&apos;s real money gaming products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
