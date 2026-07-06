import {
  useEffect,
  useState
} from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  fetchPasswordResetRequests,
  resetUserPassword,
  rejectPasswordResetRequest
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

interface PasswordResetRequest {
  id: number;
  user_id: number;
  email: string;
  business_id: number;
  status: string;
  requested_at: string;
  completed_at: string | null;
  name: string;
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

  const [resetRequests, setResetRequests] =
    useState<PasswordResetRequest[]>([]);

  const [resetPasswords, setResetPasswords] =
    useState<Record<number, string>>({});

  const [role, setRole] =
    useState('cashier');
  
  const [businessId, setBusinessId] =
    useState<number>(1);

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

  const loadPasswordResetRequests = async () => {
    try {
      const data = await fetchPasswordResetRequests();
      setResetRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadPasswordResetRequests();
  }, []);

  const handleResetPassword = async (
    requestId: number
  ) => {
    const newPassword = resetPasswords[requestId];

    if (!newPassword) {
      alert('Please enter a new password.');
      return;
    }

    const confirmed = window.confirm(
      'Reset password for this user?'
    );

    if (!confirmed) return;

    try {
      await resetUserPassword(
        requestId,
        newPassword
      );

      alert('Password reset successfully.');

      setResetPasswords((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });

      loadPasswordResetRequests();
    } catch (error) {
      console.error(error);
      alert('Failed to reset password.');
    }
  };

  const handleRejectPasswordReset = async (
    requestId: number
  ) => {
    const confirmed = window.confirm(
      'Reject this password reset request?'
    );

    if (!confirmed) return;

    try {
      await rejectPasswordResetRequest(requestId);

      alert('Password reset request rejected.');

      loadPasswordResetRequests();
    } catch (error) {
      console.error(error);
      alert('Failed to reject password reset request.');
    }
  };

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
              businessId
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
            businessId

        });

      }

      // Reset form

      setName('');
      setEmail('');
      setPassword('');
      setRole('cashier');
      setBusinessId(1);
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

    setBusinessId(user.business_id);

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
            md:grid-cols-5
            gap-4
          ">

            {/* Name */}

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value.toUpperCase()
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

            {/* Business */}

            <select
              value={businessId}
              onChange={(e) =>
                setBusinessId(
                  Number(e.target.value)
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

              <option value={1}>
                1 - ROMA Hardware
              </option>

              <option value={2}>
                2 - The One Racing Motorshop
              </option>

            </select>

            <p
              className="
                mt-1
                text-xs
                text-zinc-500
                dark:text-zinc-400
              "
            >
              Note: Users with the <strong>Admin</strong> role can sign in to any business regardless of the assigned business.
            </p>

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

        {/* Password Reset Requests */}

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
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold">
              Password Reset Requests
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Pending password reset requests from staff.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-500">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-500">
                    Requested At
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-500">
                    New Password
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-medium text-zinc-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {resetRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-6 text-sm text-zinc-500"
                    >
                      No pending password reset requests.
                    </td>
                  </tr>
                ) : (
                  resetRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-zinc-100 dark:border-zinc-800"
                    >
                      <td className="px-6 py-4 font-medium">
                        {request.name}
                      </td>

                      <td className="px-6 py-4 text-zinc-500">
                        {request.email}
                      </td>

                      <td className="px-6 py-4 text-zinc-500">
                        {new Date(request.requested_at).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <input
                          type="password"
                          placeholder="New password"
                          value={resetPasswords[request.id] || ''}
                          onChange={(e) =>
                            setResetPasswords({
                              ...resetPasswords,
                              [request.id]: e.target.value
                            })
                          }
                          className="
                            bg-white
                            dark:bg-zinc-900
                            border
                            border-zinc-200
                            dark:border-zinc-800
                            rounded-md
                            px-3
                            py-2
                            text-sm
                          "
                        />
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleResetPassword(request.id)
                            }
                            className="text-sm font-medium text-blue-600"
                          >
                            Reset Password
                          </button>

                          <button
                            onClick={() =>
                              handleRejectPasswordReset(request.id)
                            }
                            className="text-sm font-medium text-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
                        disabled={
                          user.role === 'admin' &&
                          currentUser?.id !== user.id
                        }
                        className={`
                          text-sm
                          font-medium
                          ${
                            user.role === 'admin' &&
                            currentUser?.id !== user.id
                              ? `
                                text-zinc-400
                                cursor-not-allowed
                              `
                              : `
                                text-blue-600
                              `
                          }
                        `}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        disabled={
                          currentUser?.id === user.id
                        }
                        className={`
                          text-sm
                          font-medium
                          ${
                            currentUser?.id === user.id
                              ? `
                                text-zinc-400
                                cursor-not-allowed
                              `
                              : `
                                text-red-600
                              `
                          }
                        `}
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