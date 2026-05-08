import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import {
  LayoutDashboard, Users, CalendarCheck, CreditCard,
  Home, BookOpen, Bell, LogOut, Settings, Calendar,
  FileText, MessageSquare, Shield
} from 'lucide-react'

// Role-based menu items
const menuConfig = {
  super_admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Students', icon: Users, to: '/students' },
    { label: 'Faculty', icon: Users, to: '/faculty' },
    { label: 'Attendance', icon: CalendarCheck, to: '/attendance' },
    { label: 'Fees', icon: CreditCard, to: '/fees' },
    { label: 'Hostel', icon: Home, to: '/hostel' },
    { label: 'Exams', icon: BookOpen, to: '/exams' },
    { label: 'Events', icon: Calendar, to: '/events' },
    { label: 'Documents', icon: FileText, to: '/documents' },
    { label: 'Feedback', icon: MessageSquare, to: '/feedback' },
    { label: 'Admin Panel', icon: Shield, to: '/admin' },
    { label: 'Settings', icon: Settings, to: '/settings' },
  ],
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Students', icon: Users, to: '/students' },
    { label: 'Attendance', icon: CalendarCheck, to: '/attendance' },
    { label: 'Fees', icon: CreditCard, to: '/fees' },
    { label: 'Hostel', icon: Home, to: '/hostel' },
    { label: 'Exams', icon: BookOpen, to: '/exams' },
    { label: 'Admin Panel', icon: Shield, to: '/admin' },
  ],
  student: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'My Attendance', icon: CalendarCheck, to: '/attendance' },
    { label: 'My Fees', icon: CreditCard, to: '/fees' },
    { label: 'Timetable', icon: Calendar, to: '/timetable' },
    { label: 'Exams', icon: BookOpen, to: '/exams' },
    { label: 'Hostel', icon: Home, to: '/hostel' },
    { label: 'Events', icon: Calendar, to: '/events' },
  ],
  faculty: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Students', icon: Users, to: '/students' },
    { label: 'Mark Attendance', icon: CalendarCheck, to: '/attendance' },
    { label: 'Timetable', icon: Calendar, to: '/timetable' },
    { label: 'Exams', icon: BookOpen, to: '/exams' },
  ],
  warden: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Hostel', icon: Home, to: '/hostel' },
    { label: 'Gate Pass', icon: FileText, to: '/gatepass' },
    { label: 'Night Attendance', icon: CalendarCheck, to: '/attendance' },
  ],
  accountant: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    { label: 'Fees', icon: CreditCard, to: '/fees' },
    { label: 'Reports', icon: FileText, to: '/reports' },
  ],
}

export default function Sidebar({ isOpen, onClose }) {
  const { role, logout, user } = useAuthStore()
  const menuItems = menuConfig[role] || menuConfig.student

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-900 dark:bg-gray-950 z-30 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-white font-bold text-lg">🎓 College ERP</h1>
          <p className="text-gray-400 text-xs mt-1 capitalize">{role?.replace('_', ' ')}</p>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {menuItems.map(item => (
            <NavLink key={item.to} to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
                ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              onClick={onClose}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <button onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}
