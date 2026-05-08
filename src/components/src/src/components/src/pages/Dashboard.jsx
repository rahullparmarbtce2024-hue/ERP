import { useAuthStore } from '../store/authStore'
import { useQuery } from '@tanstack/react-query'
import api from '../api/auth'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const StatCard = ({ label, value, color, icon }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 ${color} shadow-sm`}>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
  </div>
)

function StudentDashboard() {
  const { data } = useQuery({ queryKey: ['student-dashboard'], queryFn: () => api.get('/api/students/dashboard') })
  const d = data?.data
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Attendance" value={`${d?.attendance_pct ?? '--'}%`} color="border-green-500" />
        <StatCard label="Fee Status" value={d?.fee_status ?? 'Paid'} color="border-blue-500" />
        <StatCard label="CGPA" value={d?.cgpa ?? '--'} color="border-purple-500" />
        <StatCard label="Pending Dues" value={`₹${d?.pending_dues ?? 0}`} color="border-red-500" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Attendance Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={d?.attendance_chart ?? []}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis domain={[0,100]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Area type="monotone" dataKey="percentage" stroke="#3b82f6" fill="#bfdbfe" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function AdminDashboard() {
  const { data } = useQuery({ queryKey: ['admin-stats'], queryFn: () => api.get('/api/admin/stats') })
  const d = data?.data
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={d?.total_students ?? '--'} color="border-blue-500" />
        <StatCard label="Faculty" value={d?.total_faculty ?? '--'} color="border-green-500" />
        <StatCard label="Fee Collected" value={`₹${d?.fee_collected ?? 0}`} color="border-purple-500" />
        <StatCard label="Low Attendance" value={d?.low_attendance_count ?? 0} color="border-red-500" />
      </div>
    </div>
  )
}

const dashboardMap = {
  student: StudentDashboard,
  parent: StudentDashboard,
  admin: AdminDashboard,
  super_admin: AdminDashboard,
  faculty: AdminDashboard,
  warden: AdminDashboard,
  accountant: AdminDashboard,
}

export default function Dashboard() {
  const { role } = useAuthStore()
  const DashComp = dashboardMap[role] || StudentDashboard
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Welcome back 👋
      </h2>
      <DashComp />
    </div>
  )
}
