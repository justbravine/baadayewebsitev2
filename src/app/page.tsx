'use client';

import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaWifi, FaArrowRight, FaPhoneAlt, FaEnvelope, FaGithub } from "react-icons/fa";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    loanAmount: "2000",
    loanDuration: "5",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success('Application submitted successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          location: '',
          loanAmount: '2000',
          loanDuration: '5',
        });
      } else {
        toast.error(result.error || 'Submission failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <nav className="bg-slate-950/90 shadow-lg border-b border-slate-800 sticky top-0 z-50 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-3">
            <FaWifi className="text-blue-500 text-xl animate-pulse" />
            <span className="text-2xl font-extrabold tracking-tight text-white">Baadaye</span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-blue-400 transition">Home</a>
            <a href="#how" className="hover:text-blue-400 transition">How it Works</a>
            <a href="#apply" className="hover:text-blue-400 transition">Apply</a>
            <a href="#contact" className="hover:text-blue-400 transition">Contact</a>
            <a href="/admin/login" className="hover:text-blue-400 transition">Admin Login</a>
          </div>
        </div>
      </nav>

      <main className="flex-grow px-4 py-16">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Stay Connected. <span className="text-blue-500">Pay Later.</span>
            </h1>
            <p className="text-slate-400 text-lg">
              With Baadaye, you don&apos;t have to worry about getting disconnected. Stay online when it matters most — even if you can&apos;t pay right away. Qualified users can delay their WiFi payment for 5 to 7 days, with just a simple 10% convenience fee.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg transition-all"
            >
              Apply Now <FaArrowRight className="animate-horizontal-bounce" />
            </a>
          </motion.div>
        </section>

        {/* Decorative Wave */}
        <div className="my-12 h-[3px] w-full bg-gradient-to-r from-blue-600/20 via-blue-400 to-blue-600/20 rounded-full"></div>

        {/* How It Works Section */}
        <section id="how" className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">How Baadaye Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Choose Baadaye", "Pick 5–7 day delay", "Stay connected", "Pay later + 10%"].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/60 border border-slate-700 p-6 rounded-xl backdrop-blur-md shadow-lg"
              >
                <p className="text-blue-400 font-semibold text-lg">Step {index + 1}</p>
                <p className="text-slate-300 mt-2 text-sm">{text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Application Form Section */}
        <section
          id="apply"
          className="max-w-3xl mx-auto mt-24 bg-slate-800/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-slate-700"
        >
          <h2 className="text-2xl font-bold mb-6">Application Form</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
                    required
                  />
                </div>
              </div>
              <input
                type="text"
                name="location"
                placeholder="Location (e.g., Nairobi, Westlands)"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Loan Amount (KSH)
                  </label>
                  <select
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
                    required
                  >
                    {[2000, 2500, 3000, 3500, 4000].map((amount) => (
                      <option key={amount} value={amount}>
                        KSH {amount.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">
                    Loan Duration
                  </label>
                  <select
                    name="loanDuration"
                    value={formData.loanDuration}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2"
                    required
                  >
                    {[5, 6, 7].map((days) => (
                      <option key={days} value={days}>
                        {days} {days === 1 ? 'Day' : 'Days'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Submit Application
            </button>
          </form>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-950 text-slate-400 py-14 mt-20 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">About Baadaye</h3>
            <p className="text-sm leading-relaxed">
              Baadaye is a service by Hyphen Group and LIT. It helps reliable WiFi users delay their payments for 5–7 days, with just a 10% fee. Simple, safe, and stress-free.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400">Home</a></li>
              <li><a href="#how" className="hover:text-blue-400">How It Works</a></li>
              <li><a href="#apply" className="hover:text-blue-400">Apply</a></li>
              <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><FaPhoneAlt className="text-blue-500" /> 0722 442 552</li>
              <li className="flex items-center gap-2"><FaPhoneAlt className="text-blue-500" /> 0706 442 552</li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-blue-500" /> support@baadaye.com</li>
              <li className="flex items-center gap-2"><FaGithub className="text-blue-500" /> <a href="https://github.com/justbravine" target="_blank" className="hover:text-blue-400">@justbravine</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs mt-10 border-t border-slate-800 pt-4">
          <p>© {new Date().getFullYear()} Baadaye. All rights reserved.</p>
          <p className="text-slate-500">Powered by Hyphen Group and Liquid Intelligent Technologies</p>
        </div>
      </footer>
    </div>
  );
}
