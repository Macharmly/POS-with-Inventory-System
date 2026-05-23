import {
  useEffect,
  useState
} from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser
} from '../services/userService';

import {
  useAuthStore
} from '../store/authStore';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  business_id: number;
}

export default function UserManagementPage() {

  const currentUser =
    useAuthStore(
      (state) => state.user
    );

  const [users, setUsers] =
    useState<User[]>([]);

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [role, setRole] =
    useState('cashier');

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const loadUsers = async () => {

    try {

      const data =
        await fetchUsers();

      setUsers(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    loadUsers();

  }, []);

  const handleSubmit = async () => {

    // =========================
    // Guard
    // =========================

    if (!currentUser) {

      alert(
        'User session not found.'
      );

      return;

    }

    try {

      if (
        !name ||
        !email ||
        !role
      ) {

        alert(
          'Please complete required fields.'
        );

        return;

      }

      if (editingId) {

        await updateUser(
          editingId,
          {
            name,
            email,
            password,
            role,

            business_id:
              currentUser.business_id
          }
        );

      } else {

        if (!password) {

          alert(
            'Password is required.'
          );

          return;

        }

        await createUser({

          name,
          email,
          password,
          role,

          business_id:
            currentUser.business_id

        });

      }

      // Reset form

      setName('');
      setEmail('');
      setPassword('');
      setRole('cashier');
      setEditingId(null);

      loadUsers();

    } catch (error) {

      console.error(error);

      alert(
        'Failed to save user.'
      );

    }

  };

  const handleEdit = (
    user: User
  ) => {

    setEditingId(user.id);

    setName(user.name);

    setEmail(user.email);

    setRole(user.role);

  };

  const handleDelete = async (
    id: number
  ) => {

    const confirmed = window.confirm(
      'Delete this user?'
    );

    if (!confirmed) return;

    try {

      await deleteUser(id);

      loadUsers();

    } catch (error) {

      console.error(error);

      alert(
        'Failed to delete user.'
      );

    }

  };

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1 className="
            text-3xl
            font-semibold
            tracking-tight
          ">
            User Management
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Manage staff accounts and system access.
          </p>

        </div>

        {/* Form */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          shadow-sm
          p-6
          space-y-4
        ">

          <div className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-4
          ">

            {/* Name */}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
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
                text-zinc-900
                dark:text-zinc-100
              "
            />

            {/* Email */}

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) =>
                setEmail(
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
                text-zinc-900
                dark:text-zinc-100
              "
            />

            {/* Password */}

            <input
              type="password"
              placeholder={
                editingId
                  ? 'Leave blank to keep current password'
                  : 'Password'
              }
              value={password}
              onChange={(e) =>
                setPassword(
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
                text-zinc-900
                dark:text-zinc-100
              "
            />

            {/* Role */}

            <select
              value={role}
              onChange={(e) =>
                setRole(
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
                text-zinc-900
                dark:text-zinc-100
              "
            >

              <option value="cashier">
                Cashier
              </option>

              <option value="inventory">
                Inventory
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          <button
            onClick={handleSubmit}
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
            {editingId
              ? 'Update User'
              : 'Create User'}
          </button>

        </div>

        {/* Users Table */}

        <div className="
          bg-white
          dark:bg-zinc-900
          border
          border-zinc-200
          dark:border-zinc-800
          rounded-lg
          shadow-sm
          overflow-hidden
        ">

          <div className="overflow-x-auto">

            <table className="min-w-full">

              <thead className="
                border-b
                border-zinc-200
                dark:border-zinc-800
              ">

                <tr>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Name
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Email
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Role
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                    text-zinc-500
                    dark:text-zinc-400
                  ">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {users.map((user) => (

                  <tr
                    key={user.id}
                    className="
                      border-b
                      border-zinc-100
                      dark:border-zinc-800
                    "
                  >

                    <td className="
                      px-6
                      py-4
                      font-medium
                    ">
                      {user.name}
                    </td>

                    <td className="
                      px-6
                      py-4
                      text-zinc-500
                      dark:text-zinc-400
                    ">
                      {user.email}
                    </td>

                    <td className="
                      px-6
                      py-4
                      capitalize
                      text-zinc-500
                      dark:text-zinc-400
                    ">
                      {user.role}
                    </td>

                    <td className="
                      px-6
                      py-4
                      flex
                      gap-2
                    ">

                      <button
                        onClick={() =>
                          handleEdit(user)
                        }
                        className="
                          text-blue-600
                          text-sm
                          font-medium
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        className="
                          text-red-600
                          text-sm
                          font-medium
                        "
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}