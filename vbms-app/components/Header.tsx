import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  showBackButton?: boolean
  backHref?: string
  currentPage?: string
}

export default function Header({ showBackButton = false, backHref = '/', currentPage }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <Link
                href={backHref}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </Link>
            )}
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/swire-sticky-logo-1.png"
                alt="Swire"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-gray-900 border-l pl-3 border-gray-300">
                VBMS
              </span>
            </Link>
          </div>
          <nav className="flex gap-4">
            <Link
              href="/bookings"
              className={`${
                currentPage === 'bookings'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Bookings
            </Link>
            <Link
              href="/vans"
              className={`${
                currentPage === 'vans'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vans
            </Link>
            <Link
              href="/calendar"
              className={`${
                currentPage === 'calendar'
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
