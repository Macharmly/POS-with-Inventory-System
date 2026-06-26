import {
  useState
} from 'react';

import AppLayout from '../components/AppLayout';

import {
  useAuthStore
} from '../store/authStore';

export default function ProfilePage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [username, setUsername] =
    useState(
      user?.username || ''
    );

  const [password, setPassword] =
    useState('');

  const handleSave = async () => {

    const confirmed = window.confirm(
      'Are you sure you want to save these profile changes?'
    );

    if (!confirmed) return;

    try {

      const token =
        localStorage.getItem('token');

      const response = await fetch(
        `http://localhost:5000/api/users/profile/${user?.id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({

            name: username,

            password

          })

        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.error ||
          'Profile update failed'
        );

      }

      const updatedUser = {

        ...user,

        username

      };

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      );

      alert(
        'Profile updated successfully.'
      );

      window.location.reload();

    } catch (error: any) {

      alert(
        error.message ||
        'Profile update failed.'
      );

    }

  };

  return (

    <AppLayout>

      <div className="
        max-w-3xl
        mx-auto
        space-y-6
      ">

        <div>

          <h1 className="
            text-3xl
            font-semibold
            tracking-tight
          ">
            Profile Settings
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Manage your account information.
          </p>

        </div>

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          shadow-sm
          p-8
          space-y-6
        ">

          <div className="flex items-center gap-4">

            <div className="
              w-20
              h-20
              rounded-full
              bg-zinc-900
              dark:bg-zinc-100
              text-white
              dark:text-zinc-900
              flex
              items-center
              justify-center
              text-3xl
              font-semibold
            ">
              {username.charAt(0).toUpperCase()}
            </div>

            <div>

              <p className="
                text-lg
                font-medium
              ">
                {username}
              </p>

              <p className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                capitalize
              ">
                {user?.role}
              </p>

            </div>

          </div>

          <div className="space-y-4">

            <div>

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-900
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-md
                  px-3
                  py-2.5
                "
              />

            </div>

            <div>

              <label className="
                block
                text-sm
                font-medium
                mb-2
              ">
                New Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="Leave blank to keep current password"
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-900
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-md
                  px-3
                  py-2.5
                "
              />

            </div>

            <button
              onClick={handleSave}
              className="
                bg-zinc-900
                dark:bg-zinc-100
                text-white
                dark:text-zinc-900
                px-4
                py-2.5
                rounded-md
                text-sm
                font-medium
              "
            >
              Save Changes
            </button>

          </div>

        </div>

      </div>

    </AppLayout>

  );
}