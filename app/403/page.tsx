import Link from 'next/link';
import { FiShield, FiHome } from 'react-icons/fi';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 text-3xl">
          <FiShield />
        </div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">403 — Access Denied</h1>
        <p className="text-sm text-gray-500 mb-6">
          You do not have administrative privileges to access this area of Shapla Fashion.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
        >
          <FiHome />
          <span>Return to Storefront</span>
        </Link>
      </div>
    </div>
  );
}
