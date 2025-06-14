'use client';

import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function AnimatedHero() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-20 gap-10">
      <div className="max-w-xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-slate-100"
        >
          Get Connected, Pay Later.
        </motion.h2>
        <p className="text-lg text-slate-400 mt-4">
          Apply for a WiFi extension in minutes. Baadaye gives you time to pay — stress-free.
        </p>
        <a
          href="/apply"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 mt-6 rounded-full shadow-lg transition group"
        >
          Start Application
          <FiArrowRight className="group-hover:translate-x-1 transition" />
        </a>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 border border-slate-700 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-xl"
      >
        <h3 className="text-xl font-semibold mb-4">Why Choose Baadaye?</h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" /> Fast Approval
          </li>
          <li className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" /> Easy Application
          </li>
          <li className="flex items-center gap-2">
            <FiCheckCircle className="text-emerald-500" /> Secure Data
          </li>
        </ul>
      </motion.div>
    </section>
  );
} 