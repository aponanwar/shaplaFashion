'use client';

import { useState, useEffect } from 'react';
import {
  FiUsers,
  FiUserPlus,
  FiSearch,
  FiMail,
  FiPhone,
  FiShield,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiKey,
  FiRefreshCw,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
}

const INITIAL_USERS: AdminUser[] = [
  {
    _id: 'usr-1',
    name: 'Shapla Super Admin',
    email: 'admin@shaplafashion.com',
    phone: '01700000000',
    role: 'superadmin',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'usr-2',
    name: 'Kamrul Hasan (Manager)',
    email: 'manager@shaplafashion.com',
    phone: '01812345678',
    role: 'admin',
    isActive: true,
    createdAt: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'usr-3',
    name: 'Nusrat Jahan',
    email: 'nusrat@gmail.com',
    phone: '01711223344',
    role: 'customer',
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    _id: 'usr-4',
    name: 'Tanvir Ahmed',
    email: 'tanvir@gmail.com',
    phone: '01899887766',
    role: 'customer',
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as 'customer' | 'admin' | 'superadmin',
    isActive: true,
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch {
      // Fallback to initial
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGeneratePassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, password: pass }));
    toast.success('Random strong password generated!');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Please enter name, email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setUsers((prev) => [data.user, ...prev]);
        toast.success(`User "${data.user.name}" created successfully!`);
        setShowCreateModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          role: 'customer',
          isActive: true,
        });
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch {
      toast.error('Error creating user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}"?`)) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      try {
        await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      } catch {
        // Non-blocking
      }
      toast.success(`User "${name}" deleted.`);
    }
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search));

    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <FiUsers className="text-primary-600" />
            <span>User & Staff Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create store admins, managers, and view registered customers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-extrabold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <FiUserPlus size={16} /> Create New User
        </button>
      </div>

      {/* Toolbar & Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              roleFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('superadmin')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              roleFilter === 'superadmin' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Superadmin
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              roleFilter === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin / Manager
          </button>
          <button
            onClick={() => setRoleFilter('customer')}
            className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors ${
              roleFilter === 'customer' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Customers
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Role & Privilege</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-rose-200 text-primary-700 flex items-center justify-center font-bold text-xs shrink-0">
                        {u.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{u.name}</span>
                        <span className="text-[11px] text-gray-500 font-mono">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-gray-700 flex items-center gap-1 font-mono">
                      <FiPhone size={11} className="text-gray-400" />
                      {u.phone || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                        u.role === 'superadmin'
                          ? 'bg-purple-100 text-purple-700'
                          : u.role === 'admin'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <FiShield size={10} />
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {u.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                        <FiCheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] text-red-500 font-bold">
                        <FiXCircle size={12} /> Suspended
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete User"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                  <FiUserPlus size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm text-gray-900">Create New User</h3>
                  <p className="text-[11px] text-gray-400">Add an administrator, manager or customer</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-lg"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asif Mahmud"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">User Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value as any }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 font-semibold"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Store Admin / Manager</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Account Status</label>
                  <select
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.value === 'true' }))}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 font-semibold"
                  >
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-gray-700">Password *</label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1"
                  >
                    <FiKey size={11} /> Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Set initial password"
                  value={formData.password}
                  onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 active:scale-95 text-white font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
