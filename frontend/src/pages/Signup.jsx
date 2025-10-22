import { Link } from "react-router-dom";
import { useState } from "react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="dark bg-background-dark font-sans text-[#E0E0E0] min-h-screen">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="absolute top-4 md:top-8 w-full max-w-md px-4">
          <Link to="/" className="flex items-center justify-center gap-2">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              viewBox="0 0 48 48" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z" 
                fill="currentColor"
              />
            </svg>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white text-center">
              Rapid Scaffolder
            </h1>
          </Link>
        </div>
        
        {/* Signup Form */}
        <div className="glassmorphism w-full max-w-md rounded-xl p-6 md:p-8 space-y-6 mt-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold leading-tight tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-400 mt-1 text-sm md:text-base">
              Get started with your 30-day free trial.
            </p>
          </div>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">
                Full Name
              </label>
              <input 
                autoComplete="name"
                className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-transparent h-12 placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
                type="text"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <input 
                autoComplete="email"
                className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-transparent h-12 placeholder:text-gray-500 p-4 text-base font-normal leading-normal"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input 
                  autoComplete="new-password"
                  className="neumorphism-inset flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-transparent h-12 placeholder:text-gray-500 p-4 pr-12 text-base font-normal leading-normal"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-gray-400">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input 
                id="terms"
                name="terms"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary focus:ring-offset-gray-800"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" className="text-primary hover:text-primary/90 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:text-primary/90 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            
            <div>
              <button 
                className="flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-base font-bold leading-6 text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 ease-in-out"
                type="submit"
              >
                Create Account
              </button>
            </div>
          </form>
          
          <div className="relative my-4">
            <div aria-hidden="true" className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[#2a2a2a] px-2 text-gray-400 rounded-full">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <button className="social-button flex w-full items-center justify-center gap-2 md:gap-3 rounded-lg bg-white/10 px-3 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-colors">
              <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-6">Google</span>
            </button>
            
            <button className="social-button flex w-full items-center justify-center gap-2 md:gap-3 rounded-lg bg-white/10 px-3 py-3 text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20 transition-colors">
              <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.489.5.092.682-.218.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.089 2.91.833.091-.647.35-1.086.636-1.336-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.82c.85.004 1.705.115 2.504.336 1.909-1.296 2.747-1.026 2.747-1.026.546 1.376.202 2.393.1 2.646.64.698 1.027 1.59 1.027 2.682 0 3.841-2.338 4.687-4.566 4.935.359.308.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" fillRule="evenodd"/>
              </svg>
              <span className="text-xs md:text-sm font-semibold leading-6">GitHub</span>
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?
            <Link to='/login'>
              <span className="font-semibold leading-6 text-primary hover:text-primary/90 ml-1 cursor-pointer">
                Log In
              </span>
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;