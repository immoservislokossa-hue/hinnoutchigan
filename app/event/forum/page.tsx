'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Nunito, sans-serif' }}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0a0a] to-black overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/bg.jpg"
            alt="Audience"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        {/* Effet de particules subtiles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/70 to-black"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <div className="inline-block bg-red-900/30 px-4 py-2 rounded-full mb-6 border border-red-700/50">
                <span className="text-red-300 text-sm md:text-base">5ème Édition</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                <span className="text-white block">Forum</span>
                <span className="text-red-500 bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                  HINNOU TCHIGAN
                </span>
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-500 mx-auto my-6 rounded-full"></div>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
                Un événement unique qui célèbre l'amour, l'innovation et la créativité. 
                Rejoignez-nous pour une expérience inoubliable pleine d'émotions, de partage et de découvertes.
              </p>
            </motion.div>

            {/* Section avec les 5 jeunes et le compteur */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12 p-6 bg-black/30 rounded-2xl border border-white/10 backdrop-blur-sm"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i} 
                    className="relative w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src={`/images/image${i}.png`}
                      alt={`Jeune participant ${i}`}
                      fill
                      className="rounded-full object-cover border-2 border-red-500 shadow-lg"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl md:text-4xl font-bold text-yellow-400">+300</p>
                <p className="text-sm md:text-base text-gray-300">jeunes attendus</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Link
                href="/event/forum/inscription"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full uppercase tracking-wide hover:from-red-700 hover:to-red-900 transition-all shadow-lg hover:shadow-red-900/30 flex items-center justify-center gap-2"
              >
                <span>Réserver ma place</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link
                href="#programme"
                className="px-8 py-4 border border-white/30 text-white hover:bg-white/10 font-semibold rounded-full uppercase tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <span>Voir le programme</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-16 lg:py-24 bg-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative w-full h-64 md:h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl group"
          >
            <Image
              src="/images/event.png"
              alt="Événement Hinnou Tchigan"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end">
             
            </div>
          </motion.div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-red-600 mb-2 mx-auto"></div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                À propos du <span className="text-red-500">forum</span>
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Le forum HINNOU TCHIGAN rassemble chaque année les acteurs clés de notre communauté 
              pour échanger, innover et créer des synergies durables. Cette 5ème édition promet d'être 
              la plus riche en découvertes et en rencontres.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
            {[
              { 
                title: 'Réseautage', 
                desc: 'Rencontrez des professionnels et passionnés de votre domaine.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              { 
                title: 'Innovation', 
                desc: 'Découvrez les dernières tendances et innovations dans votre secteur.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              },
              { 
                title: 'Apprentissage', 
                desc: 'Participez à des ateliers pratiques et des sessions de formation.',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                )
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-8 rounded-2xl border border-white/10 shadow-xl hover:shadow-red-900/20 group"
              >
                <div className="text-red-500 mb-4 group-hover:text-yellow-400 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="py-16 lg:py-24 bg-[#1a0a0a] relative" id="programme">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block mb-4">
              <div className="w-16 h-1 bg-yellow-500 mb-2 mx-auto"></div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
                Programme
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-300">
              Découvrez le déroulé de cette journée riche en découvertes et rencontres.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {[
              { hour: '09:00 - 10:30', title: "Cérémonie d'ouverture", desc: "Mot de bienvenue et présentation des enjeux." },
              { hour: '10:30 - 12:00', title: 'Table ronde principale', desc: 'Échanges sur les tendances et innovations du secteur.' },
              { hour: '12:00 - 13:30', title: 'Pause déjeuner & networking', desc: "Échange informel autour d'un buffet." },
              { hour: '13:30 - 15:00', title: 'Ateliers parallèles', desc: 'Sessions pratiques sur des thématiques spécifiques.' },
              { hour: '15:30 - 17:00', title: 'Clôture & cocktail', desc: 'Synthèse des travaux et moment convivial.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
                className="flex mb-10 last:mb-0"
              >
                <div className="flex-shrink-0 w-24 md:w-32 text-right pr-6 pt-1">
                  <span className="bg-yellow-500/10 text-yellow-500 text-sm font-medium px-3 py-1 rounded-full">
                    {item.hour}
                  </span>
                </div>
                <div className="flex-grow relative pl-8 pb-10">
                  <div className="absolute left-0 top-2 w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <div className="absolute left-2 top-2 w-0.5 h-full bg-yellow-500/30"></div>
                  <div className="bg-gradient-to-br from-[#1a0a0a] to-[#2a0a0a] p-6 rounded-2xl border border-white/10 shadow-lg hover:border-yellow-500/30 transition-colors">
                    <h3 className="font-semibold text-lg md:text-xl mb-2 text-white">{item.title}</h3>
                    <p className="text-gray-300">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-red-700 to-red-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Prêt à nous rejoindre ?</h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Ne manquez pas cette opportunité unique de networking et d'apprentissage.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/event/forum/inscription"
                className="px-8 py-4 bg-white text-red-700 font-semibold rounded-full uppercase tracking-wide hover:bg-gray-100 transition-all shadow-lg hover:shadow-white/30 flex items-center justify-center gap-2"
              >
                <span>Réserver ma place</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <a
                href="https://wa.me/+22961030505"
                className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-red-700 font-semibold rounded-full uppercase tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <span>Nous contacter</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}