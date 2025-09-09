// pages/index.tsx

'use client';

import { useState } from 'react';
import Head from 'next/head';
import HeroSection from '@/components/layout/hero';


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8f9fa]">
      <Head>
        <title>Hinnou Tchigan 5 - Célébrons l'amour et l'union</title>
        <meta name="description" content="5ème édition de Hinnou Tchigan - L'événement dédié à la célébration de l'amour et des traditions" />
      </Head>                                                                             
      <main>       
          <HeroSection/>
      </main>

    </div>
  );
}