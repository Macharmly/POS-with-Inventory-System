import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  Eye,
  EyeOff,
  Moon,
  Sun,
  Building2,
  Wrench
} from 'lucide-react';

import { loginUser } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const businesses = [

  {
    id: 1,
    name: 'ROMA Hardware',
    description:
      'Inventory & Construction Supplies',
    icon: Building2,
    gradient:
      'from-blue-700 via-indigo-700 to-gray-900'
  },

  {
    id: 2,
    name: 'The One Racing Motorshop',
    description:
      'Motor Parts, Repairs & Services',
    icon: Wrench,
    gradient:
      'from-zinc-900 via-black to-zinc-950'
  }

];

export default function LoginPage() {

  const navigate = useNavigate();

  const login = useAuthStore(
    (state) => state.login
  );

  const [email,
    setEmail] =
    useState('');

  const [password,
    setPassword] =
    useState('');

  const [selectedBusiness,
    setSelectedBusiness] =
    useState<number | null>(1);

  const [showPassword,
    setShowPassword] =
    useState(false);

  const [error,
    setError] =
    useState('');

  const [loading,
    setLoading] =
    useState(false);

  const [darkMode,
    setDarkMode] =
    useState(() => {

      return localStorage.getItem(
        'theme'
      ) !== 'light';

    });

  useEffect(() => {

    if (darkMode) {

      document.documentElement
        .classList.add('dark');

      localStorage.setItem(
        'theme',
        'dark'
      );

    } else {

      document.documentElement
        .classList.remove('dark');

      localStorage.setItem(
        'theme',
        'light'
      );

    }

  }, [darkMode]);

  const currentBusiness =
    businesses.find(

      (business) =>
        business.id ===
        selectedBusiness

    );

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setError('');

      setLoading(true);

      try {

        const data =
          await loginUser(
            email,
            password,
            selectedBusiness!
          )

        login({

          ...data.user,

          selected_business:
            selectedBusiness

        });

        navigate('/dashboard');

      } catch (err: any) {

        setError(

          err.response?.data?.error ||

          'Authentication failed.'

        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="
      min-h-screen
      flex
      bg-gray-100
      dark:bg-gray-950
      transition-colors
      duration-300
    ">

      {/* LEFT SIDE */}

      <div className="
        hidden
        lg:flex
        w-1/2
        relative
        overflow-hidden
      ">

        <div
          className={`
            absolute
            inset-0
            bg-gradient-to-br

            ${currentBusiness?.gradient}
          `}
        />

        <div className="
          relative
          z-10
          flex
          flex-col
          justify-between
          h-full
          p-12
          text-white
        ">

          <div>

            <h1 className="
              text-5xl
              font-black
              tracking-tight
              leading-tight
            ">
              {currentBusiness?.name}
            </h1>

            <p className="
              mt-6
              text-lg
              text-gray-200
              max-w-md
              leading-relaxed
            ">
              {selectedBusiness === 2

                ? `
                  Smart motorshop management
                  with integrated inventory,
                  services, repairs, and POS.
                `

                : `
                  Modern hardware inventory
                  and point-of-sale management
                  built for growing businesses.
                `
              }
            </p>

          </div>

          <div className="space-y-4">

            <div className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-2xl
              p-5
            ">

              <p className="
                text-sm
                text-gray-200
              ">
                Real-time inventory monitoring
              </p>

            </div>

            <div className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-2xl
              p-5
            ">

              <p className="
                text-sm
                text-gray-200
              ">
                Secure role-based authentication
              </p>

            </div>

            <div className="
              bg-white/10
              backdrop-blur-md
              border
              border-white/20
              rounded-2xl
              p-5
            ">

              <p className="
                text-sm
                text-gray-200
              ">
                Smart analytics and reporting
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="
        flex-1
        flex
        items-center
        justify-center
        p-6
      ">

        <div className="
          w-full
          max-w-md
        ">

          {/* Theme Toggle */}

          <div className="
            flex
            justify-end
            mb-6
          ">

            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="
                w-11
                h-11
                rounded-xl
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-gray-900
                flex
                items-center
                justify-center
                transition
                hover:scale-105
              "
            >

              {darkMode ? (

                <Sun
                  size={18}
                  className="
                    text-yellow-400
                  "
                />

              ) : (

                <Moon
                  size={18}
                  className="
                    text-gray-700
                  "
                />

              )}

            </button>

          </div>

          {/* LOGIN CARD */}

          <div className="
            bg-white
            dark:bg-gray-900
            border
            border-gray-200
            dark:border-gray-800
            rounded-3xl
            shadow-2xl
            p-8
            transition-colors
            duration-300
          ">

            <div className="mb-8">

              <h2 className="
                text-3xl
                font-black
                text-gray-900
                dark:text-white
              ">
                Welcome Back
              </h2>

              <p className="
                text-sm
                text-gray-500
                dark:text-gray-400
                mt-2
              ">
                Sign in to continue.
              </p>

            </div>

            {/* Business Selection */}

            <div className="mb-6">

              <label className="
                block
                text-sm
                font-medium
                mb-3
                text-gray-700
                dark:text-gray-300
              ">
                Choose Business
              </label>

              <div className="
                grid
                grid-cols-1
                gap-3
              ">

                {businesses.map(
                  (business) => {

                    const Icon =
                      business.icon;

                    return (

                      <button
                        key={business.id}
                        type="button"
                        onClick={() =>
                          setSelectedBusiness(
                            business.id
                          )
                        }
                        className={`
                          p-4
                          rounded-2xl
                          border
                          text-left
                          transition-all

                          ${
                            selectedBusiness ===
                            business.id

                              ? `
                                border-blue-500
                                bg-blue-50
                                dark:bg-blue-950/30
                              `

                              : `
                                border-gray-200
                                dark:border-gray-700
                                hover:border-blue-400
                              `
                          }
                        `}
                      >

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-10
                            h-10
                            rounded-xl
                            bg-zinc-100
                            dark:bg-zinc-800
                            flex
                            items-center
                            justify-center
                          ">

                            <Icon size={18} />

                          </div>

                          <div>

                            <h3 className="
                              font-semibold
                              text-gray-900
                              dark:text-white
                            ">
                              {business.name}
                            </h3>

                            <p className="
                              text-sm
                              text-gray-500
                              dark:text-gray-400
                              mt-1
                            ">
                              {business.description}
                            </p>

                          </div>

                        </div>

                      </button>

                    );

                  }
                )}

              </div>

            </div>

            {/* ERROR */}

            {error && (

              <div className="
                mb-5
                bg-red-100
                dark:bg-red-950/40
                border
                border-red-300
                dark:border-red-800
                text-red-600
                dark:text-red-400
                text-sm
                rounded-xl
                p-3
              ">

                {error}

              </div>

            )}

            {/* FORM */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  mb-2
                  text-gray-700
                  dark:text-gray-300
                ">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    dark:border-gray-700
                    bg-gray-50
                    dark:bg-gray-950
                    px-4
                    py-3
                    text-gray-900
                    dark:text-white
                    outline-none
                    transition
                    focus:ring-2
                    focus:ring-blue-500
                    focus:border-transparent
                  "
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              {/* PASSWORD */}

              <div>

                <div className="
                  flex
                  items-center
                  justify-between
                  mb-2
                ">

                  <label className="
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                  ">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="
                      text-sm
                      text-blue-600
                      hover:text-blue-500
                      dark:text-blue-400
                    "
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <input
                    type={
                      showPassword

                        ? 'text'

                        : 'password'
                    }
                    placeholder="Enter your password"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-gray-300
                      dark:border-gray-700
                      bg-gray-50
                      dark:bg-gray-950
                      px-4
                      py-3
                      pr-12
                      text-gray-900
                      dark:text-white
                      outline-none
                      transition
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-transparent
                    "
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      text-gray-500
                      hover:text-gray-700
                      dark:hover:text-gray-300
                    "
                  >

                    {showPassword ? (

                      <EyeOff size={20} />

                    ) : (

                      <Eye size={20} />

                    )}

                  </button>

                </div>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !selectedBusiness
                }
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:opacity-70
                  disabled:cursor-not-allowed
                  text-white
                  font-bold
                  py-3.5
                  rounded-xl
                  transition
                  shadow-lg
                  shadow-blue-500/20
                "
              >

                {loading

                  ? 'Signing in...'

                  : 'Login'
                }

              </button>

            </form>

            {/* Footer */}

            <div className="
              mt-8
              text-center
            ">

              <p className="
                text-sm
                text-gray-500
                dark:text-gray-400
              ">
                Don&apos;t have an account?
              </p>

              <Link
                to="/register"
                className="
                  inline-block
                  mt-3
                  text-sm
                  font-semibold
                  text-blue-600
                  hover:text-blue-500
                  dark:text-blue-400
                "
              >
                Create new account
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}