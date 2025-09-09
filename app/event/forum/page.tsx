'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/images/jj.png"
              alt="Logo HINNOU TCHIGAN"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h1 className="text-xl font-bold tracking-wide">HINNOU TCHIGAN</h1>
              <p className="text-sm text-gray-400">5ème Édition</p>
            </div>
          </div>

        
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-black via-[#1a0a0a] to-black">
        <div className="absolute inset-0">
          <Image
            src="/images/bg.jpg"
            alt="Audience"
            fill
            className="object-cover opacity-20"
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffd700] to-[#c1272f]">
                HINNOU TCHIGAN
              </span>
              <span className="block text-gray-200 mt-2">5ème Édition</span>
            </motion.h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              Un événement unique qui célèbre la culture, l'innovation et la créativité. 
              Rejoignez-nous pour une expérience inoubliable pleine d'émotions, de partage et de découvertes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/event/forum/inscription"
              className="px-8 py-3 bg-black text-[#ffd700] font-semibold rounded-lg uppercase tracking-wide hover:bg-gray-900 transition-colors shadow-lg"
            >
              Réserver ma place
            </Link>
                    </div>
              <Link
                href="#programme"
                className="px-8 py-3 border border-white/30 hover:bg-white/10 font-semibold rounded-lg uppercase tracking-wide transition-colors text-center"
              >
                Voir le programme
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Présentation */}
      <section className="py-20 bg-black text-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#ffd700]">À propos du forum</h2>
            <p className="text-lg text-gray-400">
              Le forum HINNOU TCHIGAN rassemble chaque année les acteurs clés de notre communauté 
              pour échanger, innover et créer des synergies durables. Cette 5ème édition promet d'être 
              la plus riche en découvertes et en rencontres.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: 'Réseautage', desc: 'Rencontrez des professionnels et passionnés de votre domaine.' },
              { title: 'Innovation', desc: 'Découvrez les dernières tendances et innovations dans votre secteur.' },
              { title: 'Apprentissage', desc: 'Participez à des ateliers pratiques et des sessions de formation.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-[#111] to-[#1a1a1a] p-8 rounded-2xl border border-white/10 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-[#ffd700] mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Intervenants */}
      <section className="py-20 bg-gradient-to-br from-black to-[#1a0a0a]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#ffd700]">Nos intervenants</h2>
            <p className="text-lg text-gray-400">
              Découvrez les experts et passionnés qui partageront leurs connaissances lors de cette édition.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                className="bg-[#111] rounded-2xl overflow-hidden border border-white/10 shadow-xl p-6 text-center"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">Photo</span>
                </div>
                <h3 className="font-semibold text-lg">Nom Intervenant</h3>
                <p className="text-[#c1272f] mb-2">Spécialité</p>
                <p className="text-gray-400 text-sm">Courte description de son expertise.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="py-20 bg-black" id="programme">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#ffd700]">Programme</h2>
            <p className="text-lg text-gray-400">
              Découvrez le déroulé de cette journée riche en découvertes et rencontres.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-10">
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
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="border-l-2 border-[#ffd700] pl-6 relative"
              >
                <div className="absolute w-4 h-4 bg-[#ffd700] rounded-full -left-2 top-1"></div>
                <span className="bg-[#ffd700]/20 text-[#ffd700] text-sm font-medium px-2 py-1 rounded">
                  {item.hour}
                </span>
                <h3 className="font-semibold text-lg mt-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-20 bg-gradient-to-br from-black to-[#1a0a0a]" id="sponsors">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-[#ffd700]">Partenaires & Sponsors</h2>
            <p className="text-lg text-gray-400">
              Merci à nos partenaires sans qui cet événement ne serait pas possible.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4].map((item) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05 }}
                className="bg-[#111] rounded-xl p-6 w-32 h-32 flex items-center justify-center border border-white/10 shadow-lg"
              >
                <span className="text-gray-500 font-semibold">Logo {item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#c1272f] to-[#ffd700] text-black text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-6">Prêt à nous rejoindre ?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-10">
            Ne manquez pas cette opportunité unique de networking et d'apprentissage.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/event/forum/inscription"
              className="px-8 py-3 bg-black text-[#ffd700] font-semibold rounded-lg uppercase tracking-wide hover:bg-gray-900 transition-colors shadow-lg"
            >
              Réserver ma place
            </Link>
            <a
              href="https://wa.me/+22961030505"
              className="px-8 py-3 border-2 border-black text-black hover:bg-black hover:text-white font-semibold rounded-lg uppercase tracking-wide transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
