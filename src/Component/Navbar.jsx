"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X } from 'lucide-react'

const navLinks = ["Home", "About Us", "Price List", "Status", "Safety Tips", "Contact Us"]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kids Crackers Park
            </h1>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => navigate(link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`)}
                className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium"
              >
                {link}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-purple-600"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    navigate(link === "Home" ? "/" : `/${link.toLowerCase().replace(/ /g, "-")}`)
                    setIsOpen(false)
                  }}
                  className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium w-full text-left"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
