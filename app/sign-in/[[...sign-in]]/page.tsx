'use client';

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignInPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      const userType = user.unsafeMetadata?.userType;
      
      if (userType === 'child') {
        router.replace('/child-dashboard');
      } else if (userType === 'guardian') {
        router.replace('/guardian-dashboard');
      } else {
        // User doesn't have a role set - redirect to role selection or home
        // You can create a role selection page, or redirect to sign-up
        router.replace('/sign-up');
      }
    }
  }, [isLoaded, user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8" 
      style={{ 
        background: 'linear-gradient(135deg, #f2c84b 0%, #d4a934 100%)',
        backgroundImage: `
          linear-gradient(135deg, #f2c84b 0%, #d4a934 100%),
          radial-gradient(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)
        `
      }}
    >
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-lexend" 
          style={{ 
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            letterSpacing: '-0.02em'
          }}
        >
          Welcome Back to UMOJA
        </h1>
        <p className="text-xl md:text-2xl text-white/90 font-lexend max-w-3xl mx-auto leading-relaxed">
          Continue your journey of cultural discovery and learning
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: {
                boxShadow: 'none',
                backgroundColor: 'transparent'
              },
              card: {
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                backgroundColor: 'white',
                borderRadius: '0',
                padding: '2rem'
              },
              formButtonPrimary: {
                backgroundColor: '#2e2e2e',
                fontSize: '16px',
                padding: '12px 24px',
                textTransform: 'none',
                fontWeight: '600',
                borderRadius: '0',
                '&:hover': {
                  backgroundColor: '#1f1f1f',
                  transform: 'translateY(-1px)'
                },
                transition: 'all 0.2s ease'
              },
              formFieldInput: {
                backgroundColor: 'white',
                borderColor: 'rgba(0,0,0,0.1)',
                fontSize: '16px',
                padding: '12px 16px',
                borderRadius: '0',
                '&:focus': {
                  borderColor: '#2e2e2e',
                  boxShadow: '0 0 0 2px rgba(46,46,46,0.1)'
                }
              },
              formFieldLabel: {
                color: '#2e2e2e',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '6px'
              },
              headerTitle: {
                color: '#2e2e2e',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '8px'
              },
              headerSubtitle: {
                color: '#666',
                fontSize: '16px',
                marginBottom: '24px'
              },
              dividerLine: {
                backgroundColor: 'rgba(0,0,0,0.1)'
              },
              dividerText: {
                color: '#666'
              },
              formResendCodeLink: {
                color: '#2e2e2e',
                fontWeight: '500',
                '&:hover': {
                  color: '#1f1f1f'
                }
              },
              footerActionLink: {
                color: '#2e2e2e',
                fontWeight: '500',
                '&:hover': {
                  color: '#1f1f1f'
                }
              },
              socialButtonsBlockButton: {
                borderColor: 'rgba(0,0,0,0.1)',
                backgroundColor: 'white',
                padding: '12px 16px',
                borderRadius: '0',
                '&:hover': {
                  backgroundColor: '#f9f9f9',
                  borderColor: 'rgba(0,0,0,0.2)'
                },
                transition: 'all 0.2s ease'
              },
              socialButtonsBlockButtonText: {
                color: '#2e2e2e',
                fontSize: '16px',
                fontWeight: '500'
              },
              socialButtonsBlockButtonArrow: {
                color: '#2e2e2e'
              },
              formFieldSuccessText: {
                color: '#0f766e',
                fontSize: '14px'
              },
              formFieldErrorText: {
                color: '#be123c',
                fontSize: '14px'
              },
              identityPreviewText: {
                color: '#2e2e2e',
                fontSize: '15px'
              },
              identityPreviewEditButton: {
                color: '#2e2e2e',
                '&:hover': {
                  color: '#1f1f1f'
                }
              }
            }
          }}
          signUpUrl="/sign-up"
        />
      </div>
      
      <div className="mt-8 text-center text-sm text-white/80">
        <p>© {new Date().getFullYear()} UMOJA. All rights reserved.</p>
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;500;600;700&display=swap');
        .font-lexend {
          font-family: 'Lexend Deca', sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SignInPage; 