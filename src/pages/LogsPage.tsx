import {
  useEffect,
  useState
} from 'react';

import {
  Navigate
} from 'react-router-dom';

import AppLayout from '../components/AppLayout';

import {
  X
} from 'lucide-react';

import {
  createPatchNote,
  fetchPatchNotes,
  updatePatchNote,
  deletePatchNote
} from '../services/patchNoteService';

import {
  fetchLogs
} from '../services/logService';

import {
  useAuthStore
} from '../store/authStore';

interface Log {

  id: number;

  user_name: string;

  module: string;

  action: string;

  description: string;

  created_at: string;

}

export default function LogsPage() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  // Admin only

  if (user?.role !== 'admin') {

    return <Navigate to="/" />;

  }

  const [showPatchModal, setShowPatchModal] =
  useState(false);

  const [version, setVersion] =
    useState('');

  const [title, setTitle] =
    useState('');

  const [content, setContent] =
    useState('');

  const [logs, setLogs] =
    useState<Log[]>([]);

  const [patchNotes, setPatchNotes] =
    useState<any[]>([]);

  const [editingPatchId, setEditingPatchId] =
    useState<number | null>(null);

  const loadLogs = async () => {

    try {

      const data =
        await fetchLogs();

      setLogs(data);

    } catch (error) {

      console.error(error);

    }

  };

  const loadPatchNotes = async () => {

    try {

      const data =
        await fetchPatchNotes();

      setPatchNotes(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    loadLogs();

    loadPatchNotes();

  }, []);

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
            Activity Logs
          </h1>

          <p className="
            text-sm
            text-zinc-500
            dark:text-zinc-400
            mt-1
          ">
            Monitor all activities across the system.
          </p>

        </div>

        {/* Logs Table */}

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

          <div
            className="
              overflow-auto
              max-h-[500px]
            "
          >

            <table className="min-w-full">

              <thead
                className="
                  sticky
                  top-0
                  bg-white
                  dark:bg-zinc-900
                  z-10
                  border-b
                  border-zinc-200
                  dark:border-zinc-800
                "
              >

                <tr>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    User
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Module
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Action
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Description
                  </th>

                  <th className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-medium
                  ">
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {logs.length === 0 ? (

                  <tr>

                    <td
                      colSpan={5}
                      className="
                        px-6
                        py-10
                        text-center
                        text-zinc-500
                      "
                    >
                      No activity logs found.
                    </td>

                  </tr>

                ) : (

                  logs.map((log) => (

                    <tr
                      key={log.id}
                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-800
                      "
                    >

                      <td className="px-6 py-4">
                        {log.user_name}
                      </td>

                      <td className="px-6 py-4">
                        {log.module}
                      </td>

                      <td className="px-6 py-4">
                        {log.action}
                      </td>

                      <td className="px-6 py-4">
                        {log.description}
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          log.created_at
                        ).toLocaleString()}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Patch Notes Table */}

        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-lg
            shadow-sm
            overflow-hidden
          "
        >

          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Patch Notes
              </h2>

              <p className="text-sm text-zinc-500 mt-1">
                Manage system update announcements.
              </p>

            </div>

            <button
              onClick={() => {

                setEditingPatchId(null);

                setVersion('');
                setTitle('');
                setContent('');

                setShowPatchModal(true);

              }}
              className="
                px-4
                py-2
                rounded-lg
                bg-indigo-600
                text-white
                hover:bg-indigo-700
              "
            >
              Create Patch Note
            </button>

          </div>

          <div
            className="
              overflow-auto
              max-h-[750px]
            "
          >

            <table className="min-w-full">

              <thead
                className="
                  sticky
                  top-0
                  bg-white
                  dark:bg-zinc-900
                  z-10
                  border-b
                  border-zinc-200
                  dark:border-zinc-800
                "
              >

                <tr>

                  <th className="px-6 py-4 text-left">
                    Version
                  </th>

                  <th className="px-6 py-4 text-left">
                    Title
                  </th>

                  <th className="px-6 py-4 text-left">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {patchNotes.length === 0 ? (

                  <tr>

                    <td
                      colSpan={4}
                      className="
                        px-6
                        py-10
                        text-center
                        text-zinc-500
                      "
                    >
                      No patch notes found.
                    </td>

                  </tr>

                ) : (

                  patchNotes.map((patch) => (

                    <tr
                      key={patch.id}
                      className="
                        border-b
                        border-zinc-100
                        dark:border-zinc-800
                      "
                    >

                      <td className="px-6 py-4">
                        {patch.version}
                      </td>

                      <td className="px-6 py-4">
                        {patch.title}
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          patch.created_at
                        ).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 flex gap-2">

                        <button
                          onClick={() => {

                            setEditingPatchId(
                              patch.id
                            );

                            setVersion(
                              patch.version
                            );

                            setTitle(
                              patch.title
                            );

                            setContent(
                              patch.content
                            );

                            setShowPatchModal(true);

                          }}
                          className="
                            px-3
                            py-1
                            rounded
                            bg-blue-600
                            text-white
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={async () => {

                            if (
                              !window.confirm(
                                'Delete this patch note?'
                              )
                            ) {
                              return;
                            }

                            try {

                              await deletePatchNote(
                                patch.id
                              );

                              await loadPatchNotes();

                            } catch (error) {

                              console.error(error);

                            }

                          }}
                          className="
                            px-3
                            py-1
                            rounded
                            bg-red-600
                            text-white
                          "
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* Create Patch Note Modal */}

      {showPatchModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-2xl
              bg-white
              dark:bg-zinc-900
              rounded-xl
              shadow-xl
              overflow-hidden
            "
          >

            {/* Header */}

            <div
              className="
                flex
                items-center
                justify-between
                px-6
                py-4
                border-b
                border-zinc-200
                dark:border-zinc-800
              "
            >

              <div>

                <h2 className="text-xl font-semibold">
                  {editingPatchId
                    ? 'Edit Patch Note'
                    : 'Create Patch Note'}
                </h2>

                <p className="
                  text-sm
                  text-zinc-500
                  dark:text-zinc-400
                  mt-1
                ">
                  Publish an update announcement for all users.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowPatchModal(false)
                }
                className="
                  p-2
                  rounded-lg
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                  transition
                "
              >
                <X size={20} />
              </button>

            </div>

            {/* Body */}

            <div className="p-6 space-y-5">

              {/* Version */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  mb-2
                ">
                  Version
                </label>

                <input
                  type="text"
                  value={version}
                  onChange={(e) =>
                    setVersion(
                      e.target.value
                    )
                  }
                  placeholder="Example: 1.2.0"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-lg
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    bg-transparent
                    outline-none
                  "
                />

              </div>

              {/* Title */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  mb-2
                ">
                  Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) =>
                    setTitle(
                      e.target.value
                    )
                  }
                  placeholder="Example: Service Management Update"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-lg
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    bg-transparent
                    outline-none
                  "
                />

              </div>

              {/* Content */}

              <div>

                <label className="
                  block
                  text-sm
                  font-medium
                  mb-2
                ">
                  Patch Details
                </label>

                <textarea
                  value={content}
                  onChange={(e) =>
                    setContent(
                      e.target.value
                    )
                  }
                  rows={8}
                  placeholder={`Every line will appear as a bulleted list in dashboard announcement.\n\nExample:\n- Added new service management features\n- Improved sales reporting\n- Fixed various bugs and performance issues`}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-zinc-300
                    dark:border-zinc-700
                    bg-transparent
                    p-4
                    resize-none
                    outline-none
                  "
                />

              </div>

            </div>

            {/* Footer */}

            <div
              className="
                flex
                justify-end
                gap-3
                px-6
                py-4
                border-t
                border-zinc-200
                dark:border-zinc-800
              "
            >

              <button
                onClick={() =>
                  setShowPatchModal(false)
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  border
                  border-zinc-300
                  dark:border-zinc-700
                "
              >
                Cancel
              </button>

              <button
                onClick={async () => {

                  try {

                    if (editingPatchId) {

                      await updatePatchNote(
                        editingPatchId,
                        {
                          version,
                          title,
                          content
                        }
                      );

                    } else {

                      await createPatchNote({
                        version,
                        title,
                        content,
                        created_by: user!.id
                      });

                      setEditingPatchId(null);

                    }

                    await loadPatchNotes();

                    setVersion('');
                    setTitle('');
                    setContent('');

                    setShowPatchModal(false);

                  } catch (error) {

                    console.error(error);

                  }

                }}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-indigo-600
                  text-white
                  hover:bg-indigo-700
                  transition
                "
              >
                {editingPatchId
                  ? 'Save Changes'
                  : 'Publish Patch Note'}
              </button>

            </div>

          </div>

        </div>

      )}

    </AppLayout>

  );

}