import {
  useNavigate,
  useLocation
} from 'react-router-dom';

import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  History,
  Boxes,
  PackagePlus,
  SlidersHorizontal,
  Wrench,
  BarChart3,
  Users,
  Moon,
  Sun,
  LogOut
} from 'lucide-react';

import {
  useAuthStore
} from '../store/authStore';

import {
  useThemeStore
} from '../store/themeStore';

import {
  rolePermissions
} from '../config/permissions';

const navigation = [

  // Main

  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard
  },

  {
    label: 'POS',
    path: '/pos',
    icon: ShoppingCart
  },

  // Finance

  {
    label: 'Finance',
    path: '/finance',
    icon: Wallet
  },

  {
    label: 'Sales History',
    path: '/sales-history',
    icon: History
  },

  // Inventory

  {
    label: 'Inventory',
    path: '/inventory',
    icon: Boxes
  },

  {
    label: 'Restock',
    path: '/restock',
    icon: PackagePlus
  },

  {
    label: 'Inventory Adjustment',
    path: '/inventory-adjustment',
    icon: SlidersHorizontal
  },

  // Services

  {
    label: 'Services',
    path: '/services',
    icon: Wrench
  },

  // Reports

  {
    label: 'Reports',
    path: '/reports',
    icon: BarChart3
  },

  // Account

  {
    label: 'Users',
    path: '/users',
    icon: Users
  }

];

export default function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const logout = useAuthStore(
    (state) => state.logout
  );

  const user = useAuthStore(
    (state) => state.user
  );

  const theme = useThemeStore(
    (state) => state.theme
  );

  const toggleTheme = useThemeStore(
    (state) => state.toggleTheme
  );

  // Allowed routes based on role

  const allowedRoutes =
    rolePermissions[
      user?.role as keyof typeof rolePermissions
    ] || [];

  // Filter navigation

  const filteredNavigation =
    navigation.filter((item) => {

      // Hide Services for Hardware business

      if (
        user?.business_id === 1 &&
        item.path === '/services'
      ) {
        return false;
      }

      return allowedRoutes.includes(item.path);

    });

  return (

    <aside
      className="
        h-screen
        w-full
        lg:w-80
        bg-white/95
        dark:bg-zinc-950/95
        backdrop-blur
        border-r
        border-zinc-200
        dark:border-zinc-800
        flex
        flex-col
        overflow-hidden
      "
    >

      <div
        className="
          flex
          flex-col
          h-full
          px-4
          py-5
        "
      >

        {/* Brand */}

        <div
          className="
            mb-6
            px-2
            shrink-0
          "
        >

          <h1
            className="
              text-lg
              sm:text-xl
              font-bold
              tracking-tight
              text-zinc-900
              dark:text-zinc-100
            "
          >
            RomaOne
          </h1>

          <p
            className="
              text-xs
              sm:text-sm
              text-zinc-500
              dark:text-zinc-400
              mt-1
            "
          >
            Inventory & POS System
          </p>

        </div>

        {/* Profile */}

        <button
          onClick={() => navigate('/profile')}
          className="
            w-full
            bg-zinc-100
            dark:bg-zinc-900
            border
            border-zinc-200
            dark:border-zinc-800
            rounded-2xl
            px-4
            py-4
            mb-6
            flex
            items-center
            gap-3
            transition-all
            hover:bg-zinc-200
            dark:hover:bg-zinc-800
            text-left
            shrink-0
          "
        >

          {user?.profile_picture ? (

            <img
              src={user.profile_picture}
              alt="Profile"
              className="
                w-11
                h-11
                sm:w-12
                sm:h-12
                rounded-full
                object-cover
                shrink-0
              "
            />

          ) : (

            <div
              className="
                w-11
                h-11
                sm:w-12
                sm:h-12
                rounded-full
                bg-zinc-900
                dark:bg-zinc-100
                text-white
                dark:text-zinc-900
                flex
                items-center
                justify-center
                text-base
                font-semibold
                shrink-0
              "
            >

              {user?.username
                ?.charAt(0)
                .toUpperCase()}

            </div>

          )}

          <div className="min-w-0 flex-1">

            <p
              className="
                text-sm
                font-semibold
                text-zinc-900
                dark:text-zinc-100
                truncate
              "
            >
              {user?.username}
            </p>

            <p
              className="
                text-xs
                text-zinc-500
                dark:text-zinc-400
                mt-1
                capitalize
                truncate
              "
            >
              {user?.role}
            </p>

          </div>

        </button>

        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            space-y-1
            pr-1
          "
        >

          {filteredNavigation.map((item) => {

            const isActive =
              location.pathname === item.path;

            const Icon =
              item.icon;

            return (

              <button
                key={item.path}
                onClick={() =>
                  navigate(item.path)
                }
                className={`
                  group
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-2xl
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive

                      ? `
                        bg-zinc-900
                        text-white
                        dark:bg-zinc-100
                        dark:text-zinc-900
                        shadow-sm
                      `

                      : `
                        text-zinc-700
                        dark:text-zinc-300
                        hover:bg-zinc-100
                        dark:hover:bg-zinc-900
                      `
                  }
                `}
              >

                <div
                  className="
                    shrink-0
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                >

                  <Icon size={18} />

                </div>

                <span className="truncate">
                  {item.label}
                </span>

              </button>

            );

          })}

        </nav>

        {/* Bottom Actions */}

        <div
          className="
            pt-5
            mt-5
            border-t
            border-zinc-200
            dark:border-zinc-800
            shrink-0
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* Theme Toggle */}

            <button
              onClick={toggleTheme}
              className="
                h-11
                w-11
                sm:h-12
                sm:w-12
                flex
                items-center
                justify-center
                rounded-2xl
                border
                border-zinc-200
                dark:border-zinc-800
                bg-zinc-100
                dark:bg-zinc-900
                text-zinc-900
                dark:text-zinc-100
                transition-all
                hover:bg-zinc-200
                dark:hover:bg-zinc-800
                shrink-0
              "
            >

              {theme === 'light' ? (

                <Moon size={18} />

              ) : (

                <Sun size={18} />

              )}

            </button>

            {/* Logout */}

            <button
              onClick={() => {

                logout();

                navigate('/');

              }}
              className="
                flex-1
                flex
                items-center
                justify-center
                gap-2
                bg-red-700
                hover:bg-red-600
                text-white
                px-4
                py-3
                rounded-2xl
                text-sm
                font-medium
                transition-all
              "
            >

              <LogOut size={16} />

              <span className="truncate">
                Logout
              </span>

            </button>

          </div>

          {/* Version + Copyright */}

          <div
            className="
              mt-4
              text-[10px]
              text-zinc-400
              dark:text-zinc-500
              leading-relaxed
              text-center
              space-y-1
            "
          >

            <p>
              Version 0.3.2
            </p>

            <p>
              © 2026 RomaOne
              All Rights Reserved
            </p>

          </div>

        </div>

      </div>

    </aside>

  );

}