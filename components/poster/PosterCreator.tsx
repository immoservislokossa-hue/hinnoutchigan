'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import Image from 'next/image';

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expectations: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.from('registrations').insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          expectations: formData.expectations,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0a0a] to-black z-0"></div>
      <div className="absolute inset-0 opacity-20 z-0">
        <Image src="/images/bg.jpg" alt="Background" fill className="object-cover" />
      </div>

      <div className="relative z-10 w-full max-w-md md:max-w-lg">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h3 className="text-gray-400 mb-2 uppercase tracking-wide text-sm font-semibold">
            Forum HINNOU TCHIGAN • 5ème Édition
          </h3>
          <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto mb-4 rounded-full"></div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Réservez Votre Place
          </h1>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-8 md:p-10 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm"
            >
              {/* Nom */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="votre@email.com"
                />
              </div>

              {/* Téléphone */}
              <div className="mb-6">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Votre numéro de téléphone"
                />
              </div>

              {/* Attentes */}
              <div className="mb-8">
                <label className="block text-gray-300 mb-2 text-sm font-medium">Vos attentes</label>
                <textarea
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none h-24 transition-all"
                  placeholder="Qu'attendez-vous de cet événement ?"
                />
              </div>

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-lg uppercase tracking-wide transition-all shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Traitement...</span>
                  </>
                ) : (
                  <>
                    <span>Confirmer ma réservation</span>
                  </>
                )}
              </motion.button>

              {message && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-red-400 mt-4 text-sm">
                  {message}
                </motion.p>
              )}

              <p className="text-center text-gray-400 text-xs mt-6">
                En soumettant ce formulaire, vous acceptez de recevoir des informations concernant l'événement.
              </p>
            </motion.form>
          ) : (
            // Success message
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-8 md:p-10 rounded-2xl shadow-2xl border border-white/10 text-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Félicitations {formData.name} ! 🎉
              </h2>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Votre réservation a bien été enregistrée.
              </p>
              
              <div className="bg-black/30 p-4 rounded-lg border border-white/10 mb-6">
                <p className="text-sm text-gray-400">Un email de confirmation vous a été envoyé à</p>
                <p className="text-white font-medium">{formData.email}</p>
              </div>
              
            
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
