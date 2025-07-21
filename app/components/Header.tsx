'use client';

import React from 'react';
import Link from 'next/link';
import UserMenu from './user-menu';

export default function Header() {
  return (
    <header className="bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Pierwszy rząd - główne linki */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold mr-4">
              Link Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex items-center space-x-2">
              <Link href="/" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Links</span>
                <span className="ml-1">🔗</span>
              </Link>
              <Link href="/youtube" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>YouTube</span>
                <span className="ml-1">📺</span>
              </Link>
              <Link href="/prompts" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Prompts</span>
                <span className="ml-1">📝</span>
              </Link>
              <a href="https://flux1ai.com/prompt-generator" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Flux</span>
                <span className="ml-1">🧠</span>
              </a>
              <a href="https://edu.gotoit.pl/index.php/pracuj-w-ai-data-science/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Kurs</span>
                <span className="ml-1">📚</span>
              </a>
              <a href="https://flashcards.imprv.ai/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Powtórki</span>
                <span className="ml-1">🔄</span>
              </a>
              <a href="https://datachatter.imprv.ai/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Data</span>
                <span className="ml-1">📊</span>
              </a>
              <a href="https://flashcards.imprv.ai/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
                <span>Code</span>
                <span className="ml-1">💻</span>
              </a>
            </nav>
            <UserMenu />
          </div>
        </div>

        {/* Drugi rząd - narzędzia */}
        <div className="flex justify-end mb-4">
          <nav className="flex items-center space-x-2">
            <a href="https://ngnix.aihub.ovh/nginx/proxy" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Nginx</span>
              <span className="ml-1">🌐</span>
            </a>
            <a href="http://192.168.0.1/admin/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Pi-hole</span>
              <span className="ml-1">🛡️</span>
            </a>
            <a href="https://dash.aihub.ovh/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Homarr</span>
              <span className="ml-1">🏠</span>
            </a>
            <Link href="/todo" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>To-Do</span>
              <span className="ml-1">✅</span>
            </Link>
          </nav>
        </div>

        {/* Trzeci rząd - AI i narzędzia */}
        <div className="flex justify-end">
          <nav className="flex items-center space-x-2">
            <a href="https://console.cloud.google.com/auth/clients?invt=AbuDMg&project=n8ndive&supportedpurview=project" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Google</span>
              <span className="ml-1">☁️</span>
            </a>
            <a href="https://console.mistral.ai/build/agents/new" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Mistral</span>
              <span className="ml-1">🌪️</span>
            </a>
            <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Claude</span>
              <span className="ml-1">🤖</span>
            </a>
            <a href="https://chat.deepseek.com/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Deep</span>
              <span className="ml-1">🔍</span>
            </a>
            <a href="https://app.ultravox.ai/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Ultravox</span>
              <span className="ml-1">🎙️</span>
            </a>
            <a href="https://aistudio.google.com/prompts/new_chat" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Gemini</span>
              <span className="ml-1">♊</span>
            </a>
            <a href="https://rapidtags.io/generator" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Tags</span>
              <span className="ml-1">🏷️</span>
            </a>
            <a href="https://dribbble.com/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Dribbble</span>
              <span className="ml-1">🎨</span>
            </a>
            <a href="https://www.riffusion.com/" target="_blank" rel="noopener noreferrer" className="gradient-button text-white py-2 px-3 text-sm rounded-md hover:opacity-90">
              <span>Riff</span>
              <span className="ml-1">🎵</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}