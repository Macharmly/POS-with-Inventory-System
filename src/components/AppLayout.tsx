import { ReactNode, useState } from 'react';
import { Menu, X } from 'lucide-react';

import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children
}: AppLayoutProps) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div
      className="
        min-h-screen
        bg-zinc-50
        dark:bg-zinc-950
        text-zinc-900
        dark:text-zinc-100
      "
    >

      {/* Mobile Top Bar */}

      <header
        className="
          lg:hidden
          sticky
          top-0
          z-40
          flex
          items-center
          justify-between
          px-4
          py-3
          border-b
          border-zinc-200
          dark:border-zinc-800
          bg-white/90
          dark:bg-zinc-900/90
          backdrop-blur
        "
      >

        <button
          onClick={() => setSidebarOpen(true)}
          className="
            p-2
            rounded-xl
            hover:bg-zinc-100
            dark:hover:bg-zinc-800
            transition
          "
        >

          <Menu size={22} />

        </button>

        <h1
          className="
            text-sm
            font-semibold
            tracking-wide
          "
        >
          POS System
        </h1>

        <div className="w-9" />

      </header>

      {/* Mobile Sidebar Overlay */}

      {sidebarOpen && (

        <div
          className="
            fixed
            inset-0
            z-50
            lg:hidden
          "
        >

          {/* Backdrop */}

          <div
            className="
              absolute
              inset-0
              bg-black/50
              backdrop-blur-sm
            "
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}

          <div
            className="
              relative
              w-72
              max-w-[80%]
              h-full
              bg-white
              dark:bg-zinc-900
              border-r
              border-zinc-200
              dark:border-zinc-800
              shadow-2xl
            "
          >

            {/* Close Button */}

            <div
              className="
                flex
                justify-end
                p-4
              "
            >

              <button
                onClick={() => setSidebarOpen(false)}
                className="
                  p-2
                  rounded-xl
                  hover:bg-zinc-100
                  dark:hover:bg-zinc-800
                  transition
                "
              >

                <X size={22} />

              </button>

            </div>

            <Sidebar />

          </div>

        </div>

      )}

      {/* Desktop Sidebar */}

      <aside
        className="
          hidden
          lg:flex
          fixed
          top-0
          left-0
          h-screen
          w-80
          z-40
        "
      >

        <Sidebar />

      </aside>

      {/* Main Content */}

      <main
        className="
          min-h-screen
          p-4
          sm:p-6
          lg:pl-[22rem]
        "
      >

        {children}

      </main>

    </div>

  );

}