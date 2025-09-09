'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function ReservationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expectations: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    const { error } = await supabase.from('registrations').insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        expectations: formData.expectations,
      },
    ]);

    if (error) {
      setMessage(error.message);
    } else {
      setSubmitted(true);
      setTimeout(
        () => router.push('https://web-production-b99b2.up.railway.app/'),
        2000
      );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-lg">
        <h3 className="text-center text-gray-400 mb-6 uppercase tracking-wide">
          Étape 1 : Réservation
        </h3>
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-10 rounded-2xl shadow-2xl border border-white/10"
            >
              <h2 className="text-3xl font-bold text-center mb-6 text-[#ffd700]">
                Réservez votre place VIP
              </h2>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#ffd700]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Vos attentes</label>
                <textarea
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-[#ffd700] resize-none h-24"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#c1272f] text-black font-semibold rounded-lg uppercase shadow-lg hover:opacity-90 transition-all"
              >
                Confirmer ma réservation
              </button>

              {message && <p className="text-center text-red-500 mt-4">{message}</p>}
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-10 rounded-2xl shadow-2xl border border-white/10 text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-[#ffd700]">
                Merci {formData.name} 🎉
              </h2>
              <p className="text-gray-300 mb-6">
                Votre réservation a bien été enregistrée. Vous serez redirigé vers la génération de votre affiche.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
