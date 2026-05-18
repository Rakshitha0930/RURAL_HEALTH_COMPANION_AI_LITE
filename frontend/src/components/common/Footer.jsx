import { FaHeartbeat, FaGithub } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-primary-700">
            <FaHeartbeat className="h-5 w-5" />
            <span className="font-semibold">Rural Health Companion AI Lite</span>
          </div>
          <p className="text-center text-xs text-gray-500">
            This app provides general health information only. Always consult a qualified healthcare
            professional for medical advice.
          </p>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} RHC AI Lite</p>
        </div>
      </div>
    </footer>
  )
}
