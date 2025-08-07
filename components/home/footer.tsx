"use client";

import {
  BookOpen,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="md:w-12 md:h-12 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                <BookOpen className="md:h-7 md:w-7 h-5 w-5 text-white" />
              </div>
              <span className="md:text-3xl text-2xl font-black">Wiki Reel</span>
            </div>
            <p className="text-gray-400 md:text-lg mb-6 max-w-md">
              Transforming education through bite-sized, Instagram-style
              learning experiences. Making knowledge accessible, engaging, and
              fun for every student.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Success Stories
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-bold mb-6">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>hello@akkhil.dev</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>Mandi, Himachal, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0 max-md:text-sm max-md:text-center">
            © 2024 Wiki Reel. All rights reserved. Scroll. Learn. Test. Repeat.
          </p>
          <div className="flex gap-6 text-sm text-gray-400 max-md:hidden">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
