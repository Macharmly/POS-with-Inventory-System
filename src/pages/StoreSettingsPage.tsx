import { useEffect, useState } from 'react';

import AppLayout from '../components/AppLayout';

import {
  fetchBusinessById,
  updateBusiness
} from '../services/businessService';

import {
  useAuthStore
} from '../store/authStore';

interface BusinessForm {
  name: string;
  type: string;
  address: string;
  contact_number: string;
  email: string;
  tin_number: string;
  tax_type: string;
  receipt_footer: string;
}

export default function StoreSettingsPage() {

  const user = useAuthStore(
    (state) => state.user
  );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [form, setForm] =
    useState<BusinessForm>({
      name: '',
      type: '',
      address: '',
      contact_number: '',
      email: '',
      tin_number: '',
      tax_type: '',
      receipt_footer: ''
    });

  useEffect(() => {

    const loadBusiness = async () => {

      if (!user?.business_id) {
        return;
      }

      try {

        const data =
          await fetchBusinessById(
            Number(user.business_id)
          );

        setForm({
          name: data.name || '',
          type: data.type || '',
          address: data.address || '',
          contact_number:
            data.contact_number || '',
          email: data.email || '',
          tin_number:
            data.tin_number || '',
          tax_type:
            data.tax_type || '',
          receipt_footer:
            data.receipt_footer || ''
        });

      } catch (error) {

        console.error(error);

        setMessage(
          'Failed to load store information.'
        );

      } finally {

        setLoading(false);

      }

    };

    loadBusiness();

  }, [user]);

  const handleChange = (
    field: keyof BusinessForm,
    value: string
  ) => {

    setForm((prev) => ({
      ...prev,
      [field]: value
    }));

  };

  const handleSave = async () => {

    if (!user?.business_id) {
      return;
    }

    if (!form.name.trim()) {

      setMessage(
        'Store name is required.'
      );

      return;

    }

    try {

      setSaving(true);

      setMessage('');

      const response =
        await updateBusiness(
          Number(user.business_id),
          form
        );

      setMessage(
        response.message ||
        'Store information updated successfully.'
      );

    } catch (error: any) {

      console.error(error);

      setMessage(
        error.response?.data?.error ||
        'Failed to update store information.'
      );

    } finally {

      setSaving(false);

    }

  };

  if (loading) {

    return (

      <AppLayout>

        <div
          className="
            flex
            items-center
            justify-center
            h-[60vh]
          "
        >

          <p
            className="
              text-zinc-500
              dark:text-zinc-400
            "
          >
            Loading store settings...
          </p>

        </div>

      </AppLayout>

    );

  }

  return (

    <AppLayout>

      <div className="space-y-6">

        {/* Header */}

        <div>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-semibold
              tracking-tight
            "
          >
            Store Settings
          </h1>

          <p
            className="
              text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Manage store information used on receipts and reports.
          </p>

        </div>

        {/* Message */}

        {message && (

          <div
            className="
              bg-zinc-100
              dark:bg-zinc-900
              border
              border-zinc-200
              dark:border-zinc-800
              rounded-2xl
              px-4
              py-3
              text-sm
              text-zinc-700
              dark:text-zinc-300
            "
          >
            {message}
          </div>

        )}

        {/* Store Information Card */}

        <div
          className="
            bg-white
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-2xl
            shadow-sm
            overflow-hidden
          "
        >

          <div
            className="
              px-6
              py-5
              border-b
              border-zinc-200
              dark:border-zinc-800
            "
          >

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Store Information
            </h2>

            <p
              className="
                text-sm
                text-zinc-500
                dark:text-zinc-400
                mt-1
              "
            >
              These details will appear on receipts and business documents.
            </p>

          </div>

          <div
            className="
              p-6
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            "
          >

            {/* Store Name */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Store Name
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  handleChange(
                    'name',
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {/* Store Type */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Store Type
              </label>

              <input
                type="text"
                value={form.type}
                disabled
                className="
                  w-full
                  bg-zinc-100
                  dark:bg-zinc-800
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  text-zinc-500
                  cursor-not-allowed
                "
              />

            </div>

            {/* Address */}

            <div
              className="
                space-y-2
                md:col-span-2
              "
            >

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Store Address
              </label>

              <textarea
                value={form.address}
                onChange={(e) =>
                  handleChange(
                    'address',
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Enter store address"
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {/* Contact Number */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Contact Number
              </label>

              <input
                type="text"
                value={form.contact_number}
                onChange={(e) =>
                  handleChange(
                    'contact_number',
                    e.target.value
                  )
                }
                placeholder="e.g. 09123456789"
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {/* Email */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Store Email
              </label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  handleChange(
                    'email',
                    e.target.value
                  )
                }
                placeholder="store@example.com"
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {/* TIN */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                TIN Number
              </label>

              <input
                type="text"
                value={form.tin_number}
                onChange={(e) =>
                  handleChange(
                    'tin_number',
                    e.target.value
                  )
                }
                placeholder="e.g. 123-456-789-000"
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

            {/* Tax Type */}

            <div className="space-y-2">

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Tax Type
              </label>

              <select
                value={form.tax_type}
                onChange={(e) =>
                  handleChange(
                    'tax_type',
                    e.target.value
                  )
                }
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              >

                <option value="">
                  Select tax type
                </option>

                <option value="VAT">
                  VAT
                </option>

                <option value="NON-VAT">
                  NON-VAT
                </option>

              </select>

            </div>

            {/* Receipt Footer */}

            <div
              className="
                space-y-2
                md:col-span-2
              "
            >

              <label
                className="
                  text-sm
                  font-medium
                  text-zinc-700
                  dark:text-zinc-300
                "
              >
                Receipt Footer Message
              </label>

              <textarea
                value={form.receipt_footer}
                onChange={(e) =>
                  handleChange(
                    'receipt_footer',
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Thank you for your purchase!"
                className="
                  w-full
                  bg-white
                  dark:bg-zinc-950
                  border
                  border-zinc-200
                  dark:border-zinc-800
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-zinc-300
                  dark:focus:ring-zinc-700
                "
              />

            </div>

          </div>

          {/* Actions */}

          <div
            className="
              px-6
              py-5
              border-t
              border-zinc-200
              dark:border-zinc-800
              flex
              justify-end
            "
          >

            <button
              onClick={handleSave}
              disabled={saving}
              className="
                bg-zinc-900
                dark:bg-zinc-100
                text-white
                dark:text-zinc-900
                px-5
                py-3
                rounded-xl
                text-sm
                font-medium
                transition
                hover:opacity-90
                disabled:opacity-50
              "
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </div>

      </div>

    </AppLayout>

  );

}