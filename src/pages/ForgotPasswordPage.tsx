import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Mail, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [businessId, setBusinessId] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      await requestPasswordReset(email.trim(), businessId);

      setMessage(
        'If this email exists, a password reset request has been sent.'
      );

      setEmail('');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to request password reset.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
      dark:bg-gray-950
      p-6
    ">
      <div className="
        w-full
        max-w-md
        bg-white
        dark:bg-gray-900
        border
        border-gray-200
        dark:border-gray-800
        rounded-3xl
        shadow-2xl
        p-8
      ">
        <Link
          to="/"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-blue-600
            dark:text-blue-400
            mb-6
          "
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="mb-8">
          <div className="
            w-12
            h-12
            rounded-xl
            bg-blue-100
            dark:bg-blue-950/40
            flex
            items-center
            justify-center
            mb-4
          ">
            <Mail className="text-blue-600" size={22} />
          </div>

          <h1 className="
            text-3xl
            font-black
            text-gray-900
            dark:text-white
          ">
            Forgot Password
          </h1>

          <p className="
            text-sm
            text-gray-500
            dark:text-gray-400
            mt-2
          ">
            Enter your email and business to request a password reset.
          </p>
        </div>

        {message && (
          <div className="
            mb-5
            bg-green-100
            dark:bg-green-950/40
            border
            border-green-300
            dark:border-green-800
            text-green-700
            dark:text-green-400
            text-sm
            rounded-xl
            p-3
          ">
            {message}
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="
              block
              text-sm
              font-medium
              mb-2
              text-gray-700
              dark:text-gray-300
            ">
              Business
            </label>

            <select
              value={businessId}
              onChange={(e) => setBusinessId(Number(e.target.value))}
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
                focus:ring-2
                focus:ring-blue-500
              "
            >
              <option value={1}>ROMA Hardware</option>
              <option value={2}>The One Racing Motorshop</option>
            </select>
          </div>

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
                focus:ring-2
                focus:ring-blue-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim()}
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
            "
          >
            {loading ? 'Sending request...' : 'Request Password Reset'}
          </button>
        </form>
      </div>
    </div>
  );
}