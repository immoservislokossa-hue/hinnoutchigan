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
  const [chillDays, setChillDays] = useState(0);
  const [chillHours, setChillHours] = useState(0);
  const [chillMinutes, setChillMinutes] = useState(0);
  const [chillSeconds, setChillSeconds] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  // Dates des événements
  const forumDate = new Date('2025-09-18T19:00:00');
  const chillDate = new Date('2025-09-20T19:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = forumDate.getTime() - now.getTime();
      const chillDiff = chillDate.getTime() - now.getTime();

      if (diff > 0) {
        setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setMinutes(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((diff % (1000 * 60)) / 1000));
      }

      if (chillDiff > 0) {
        setChillDays(Math.floor(chillDiff / (1000 * 60 * 60 * 24)));
        setChillHours(Math.floor((chillDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        setChillMinutes(Math.floor((chillDiff % (1000 * 60 * 60)) / (1000 * 60)));
        setChillSeconds(Math.floor((chillDiff % (1000 * 60)) / 1000));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Effet de fond Canvas
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
      gradient.addColorStop(0, 'rgba(10, 0, 0, 0.95)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.max(canvas.width, canvas.height) * 0.5;

      for (let i = 0; i < 3; i++) {
        const angle = time * 0.3 + (Math.PI * 2 * i) / 3;
        const x = centerX + Math.cos(angle) * radius * 0.25;
        const y = centerY + Math.sin(angle) * radius * 0.25;

        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 0.4);
        radialGradient.addColorStop(0, `rgba(193, 39, 47, ${0.2 + i * 0.1})`);
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

  // Message pré-écrit pour WhatsApp
  const whatsappMessage = encodeURIComponent("Bonjour, je souhaite acheter mon pass pour l'événement HINNOU TCHIGAN - Forum & Chill 2025. Pouvez-vous m'aider ?");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Canvas de fond */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Contenu */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-20 text-center px-6 w-full max-w-6xl"
      >
        {/* Titre avec animations spécifiques */}
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.3 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
        >
          <motion.span 
            className="block text-white tracking-wide"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.8,
              delay: 0.2,
              type: "spring",
              stiffness: 120
            }}
          >
            <br />
            HINNOU TCHIGAN
          </motion.span>
          <motion.span 
            className="block bg-gradient-to-r from-[#ffd700] via-[#c1272f] to-[#a81c24] bg-clip-text text-transparent mt-3"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.7,
              delay: 0.5,
              type: "spring",
              stiffness: 100
            }}
          >
            Forum & Chill
          </motion.span>
          <motion.span 
            className="block text-white mt-3 text-4xl md:text-5xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            2025
          </motion.span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Deux soirées d'exception : Networking, Innovation et Détente.
        </motion.p>

        {/* Countdown principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mb-16 p-6 bg-black/40 backdrop-blur-md rounded-2xl border border-[#ffd70040] max-w-2xl mx-auto shadow-lg"
        >
          <p className="text-lg text-[#ffd700] font-semibold mb-4">
            TEMPS RESTANT AVANT LE FORUM (18 Septembre) :
          </p>
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
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-b from-[#1a1a1a] to-black p-4 rounded-xl w-20 h-20 flex items-center justify-center shadow-xl border border-[#ffd70030]">
                  {item.value}
                </div>
                <span className="text-sm text-gray-400 mt-2">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cartes Forum & Chill */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[{
            title: "Forum d'Excellence",
            description: "Conférences inspirantes, panels et networking avec les leaders d'aujourd'hui et de demain.",
            date: "18 Septembre 2025",
            img: "/images/forum.png",
            link: "/event/forum",
          }, {
            title: "Chill Session",
            description: "Ambiance détendue, échanges informels et moments de partage dans une atmosphère conviviale.",
            date: "20 Septembre 2025",
            img: "/images/chill.png",
            link: `https://wa.me/2290164936092?text=${whatsappMessage}`,
          }].map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.3 }}
              whileHover={{ y: -10 }}
              className="bg-black/50 rounded-2xl border border-[#ffffff20] shadow-xl overflow-hidden transition-all duration-300 backdrop-blur-sm"
            >
              {/* Image carrée */}
              <div className="relative w-full aspect-square">
                <Image 
                  src={event.img} 
                  alt={event.title} 
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                <p className="text-gray-300 mb-2">{event.description}</p>
                <p className="text-[#ffd700] font-semibold mb-4">{event.date}</p>
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(193, 39, 47, 0.9)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (event.link.startsWith('http')) {
                      window.open(event.link, '_blank');
                    } else {
                      router.push(event.link);
                    }
                  }}
                  className="bg-[#c1272f] bg-opacity-70 text-white font-bold py-3 px-6 rounded-xl shadow-md backdrop-blur-md border border-white border-opacity-20 transition-all"
                >
                  S'inscrire
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Signature Brandgrowthlabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 mb-8"
        >
          <motion.a
            href="https://maps.app.goo.gl/eWsqhFwLbHjMhHK97"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ffd700] hover:text-white transition-colors duration-300 flex flex-col items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-sm mb-1 opacity-80">Créé par</span>
            <span className="font-semibold text-lg border-b border-[#ffd700] border-opacity-40 hover:border-opacity-100 transition-all">
              brandgrowthlabs-AdjouEmmanuel
            </span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;