import React from 'react';
import { motion } from 'motion/react';
import { 
  Code2, 
  Cpu, 
  Globe, 
  Layers, 
  Terminal as TerminalIcon, 
  Zap, 
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

interface LandingPageProps {
  onEnterEditor: () => void;
  onGenerateProject: (template: 'react' | 'nextjs' | 'go' | 'node') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterEditor, onGenerateProject }) => {
  const supportedLanguages = [
    {
      id: 'react',
      name: 'React',
      description: 'Build modern user interfaces with the most popular frontend library.',
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      color: 'border-sky-400/20 hover:border-sky-400/50',
      bg: 'bg-sky-400/5'
    },
    {
      id: 'nextjs',
      name: 'Next.js',
      description: 'The React framework for the web, optimized for performance and SEO.',
      icon: <Layers className="w-6 h-6 text-white" />,
      color: 'border-white/20 hover:border-white/50',
      bg: 'bg-white/5'
    },
    {
      id: 'go',
      name: 'Go',
      description: 'Build fast, reliable, and efficient software at scale with Golang.',
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      color: 'border-cyan-400/20 hover:border-cyan-400/50',
      bg: 'bg-cyan-400/5'
    },
    {
      id: 'node',
      name: 'Node.js',
      description: 'Scalable network applications built on Chrome\'s V8 JavaScript engine.',
      icon: <TerminalIcon className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-400/20 hover:border-emerald-400/50',
      bg: 'bg-emerald-400/5'
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-black font-bold" />
          </div>
          <span className="text-xl font-bold tracking-tighter">NEW ERA IDE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Templates</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <button 
          onClick={onEnterEditor}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all"
        >
          Open Editor
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full -z-10" />
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold mb-8"
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>POWERED BY AI — NOW IN BETA</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl font-bold tracking-tight mb-6 max-w-4xl leading-[0.9]"
        >
          Ace your next project <br />
          <span className="text-orange-500 italic font-serif">with real speed</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
        >
          Generate production-ready codebases in seconds. 
          Integrated terminal, real-time preview, and AI-powered 
          collaboration for modern engineering teams.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button 
            onClick={onEnterEditor}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl transition-all flex items-center gap-2 group"
          >
            Get started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all">
            Browse Templates —
          </button>
        </motion.div>

        {/* Floating Code Snippet (Matches Image) */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-40 right-[0%] hidden xl:block w-[450px] p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl text-left font-mono text-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="ml-2 text-zinc-500 text-xs">use-fetch.jsx</span>
          </div>
          <pre className="text-zinc-400 overflow-x-auto">
            <code>
              {`import { useState, useEffect } from 'react';`}
            </code>
          </pre>
        </motion.div> */}

        {/* User Proof */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 100].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/user${i}/100/100`} 
                  alt="User" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          <p className="text-zinc-500 text-sm">
            <span className="text-white font-bold">2,400+ engineers</span> building the future via New Era IDE
          </p>
        </motion.div>
      </section>

      {/* Supported Languages Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Supported Environments
            </h2>
            <p className="text-zinc-400 max-w-xl">
              We support the most popular modern stacks out of the box. 
              Generate, edit, and deploy with a single click.
            </p>
          </div>
          <div className="flex items-center gap-2 text-orange-500 font-bold cursor-pointer group">
            View all languages
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportedLanguages.map((lang, idx) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              onClick={() => onGenerateProject(lang.id as any)}
              className={`p-8 rounded-3xl border ${lang.color} ${lang.bg} transition-all cursor-pointer group relative overflow-hidden`}
            >
              <div className="mb-6 p-3 bg-black/40 rounded-2xl w-fit border border-white/5">
                {lang.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{lang.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                {lang.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Generate Now
                <ArrowRight className="w-4 h-4" />
              </div>
              
              {/* Decorative background element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-black font-bold" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase">NEW ERA IDE</span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8">
              The next generation of web development. 
              Built for speed, collaboration, and AI-first workflows.
            </p>
            <div className="flex items-center gap-4">
              <Twitter className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="hover:text-white cursor-pointer transition-colors">Features</li>
              <li className="hover:text-white cursor-pointer transition-colors">Templates</li>
              <li className="hover:text-white cursor-pointer transition-colors">Integrations</li>
              <li className="hover:text-white cursor-pointer transition-colors">Changelog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li className="hover:text-white cursor-pointer transition-colors">About</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 uppercase tracking-widest font-bold">
          <p>© 2026 NEW ERA IDE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
