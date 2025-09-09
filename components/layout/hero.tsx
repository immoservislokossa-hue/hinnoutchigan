'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const HeroSection = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  // Dates des événements
  const forumDate = new Date('2025-09-18T19:00:00');

  useEffect(() => {
    // Compte à rebours
    const updateCountdown = () => {
      const now = new Date();
      const timeUntilForum = forumDate.getTime() - now.getTime();

      if (timeUntilForum > 0) {
        setDays(Math.floor(timeUntilForum / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((timeUntilForum % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((timeUntilForum % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((timeUntilForum % (1000 * 60)) / 1000));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Effet Canvas luxe
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, 'rgba(20, 0, 0, 0.95)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.5;

      for (let i = 0; i < 3; i++) {
        const angle = time * 0.4 + (Math.PI * 2 * i) / 3;
        const x = centerX + Math.cos(angle) * radius * 0.3;
        const y = centerY + Math.sin(angle) * radius * 0.3;

        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.5);
        radialGradient.addColorStop(0, `rgba(193, 39, 47, ${0.15 + i * 0.1})`);
        radialGradient.addColorStop(1, 'rgba(193, 39, 47, 0)');

        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black p-4">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Lumière luxe */}
      <div className="absolute inset-4 sm:inset-8 md:inset-12 rounded-3xl border border-[#ffffff15] pointer-events-none z-10" />

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-20 text-center text-white w-full max-w-6xl"
      >
        {/* Titre */}
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] via-[#c1272f] to-[#a81c24] drop-shadow-lg">
            Forum & Gala
          </span>
          <span className="block text-white mt-3">d'Excellence 2025</span>
        </motion.h1>

        {/* Sous-titre */}
        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Deux soirées d’exception : Networking, Innovation et Prestige.
        </p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-12 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-[#ffd70040] max-w-2xl mx-auto shadow-xl"
        >
          <p className="text-lg text-[#ffd700] font-semibold mb-4">TEMPS RESTANT AVANT LE FORUM :</p>
          <div className="flex justify-center space-x-6">
            {[{ value: days, label: 'Jours' },
              { value: hours, label: 'Heures' },
              { value: minutes, label: 'Minutes' },
              { value: seconds, label: 'Secondes' }].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white bg-gradient-to-b from-[#1a1a1a] to-black p-4 rounded-xl w-20 h-20 flex items-center justify-center shadow-lg border border-[#ffffff15]">
                  {item.value}
                </div>
                <span className="text-sm text-gray-400 mt-2">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Boutons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/event/forum')}
            className="relative overflow-hidden bg-gradient-to-r from-[#ffd700] via-[#c1272f] to-[#a81c24] text-white font-bold py-4 px-10 rounded-xl text-lg shadow-xl transition-all duration-300"
          >
            S'inscrire au Forum
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/event/gala')}
            className="relative overflow-hidden bg-gradient-to-r from-[#a81c24] via-[#c1272f] to-[#ffd700] text-white font-bold py-4 px-10 rounded-xl text-lg shadow-xl transition-all duration-300"
          >
            S'inscrire au Gala
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
