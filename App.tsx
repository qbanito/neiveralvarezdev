import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, ChevronDown, Code, Zap, Globe, Award, QrCode, FileText, X, Download, Share2, Briefcase, GraduationCap, User } from 'lucide-react';
import { PROJECTS, CONTACT_INFO, EXPERIENCE_YEARS, COMPANY_NAME, DEVELOPER_NAME, RESUME_DATA, TITLE, PROFILE_IMAGE } from './constants';
import { ProjectCard } from './components/ProjectCard';

function App() {
  const [showCV, setShowCV] = useState(false);
  const [showCard, setShowCard] = useState(false);

  // Helper to close modals
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCV(false);
      setShowCard(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl font-serif">
              N
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Neiver Dev</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <button onClick={() => setShowCV(true)} className="hover:text-cyan-400 transition-colors">Resume</button>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <a 
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2 rounded-full bg-slate-100 text-slate-900 font-semibold hover:bg-cyan-400 hover:text-slate-900 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
          >
            Let's Talk
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-wider mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AVAILABLE FOR NEW PROJECTS
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-serif tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Building Digital <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Empires
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Crafting elegant, high-performance web solutions. <br/>
            I am <strong className="text-white">{DEVELOPER_NAME}</strong>, the architect behind {COMPANY_NAME}.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <button
              onClick={() => setShowCard(true)}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-slate-900 font-bold shadow-lg shadow-white/10 hover:shadow-cyan-400/50 hover:-translate-y-1 transition-all"
            >
              <QrCode size={18} />
              Digital Card
            </button>
            <button
              onClick={() => setShowCV(true)}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-slate-800/50 border border-slate-700 text-white font-semibold hover:bg-slate-800 hover:border-cyan-500/50 transition-all backdrop-blur-sm"
            >
              <FileText size={18} />
              View Resume
            </button>
          </div>
        </div>

        <a href="#projects" className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 hover:text-white transition-colors animate-bounce">
          <ChevronDown size={32} />
        </a>
      </section>

      {/* Bio / Stats Section */}
      <section id="about" className="py-24 bg-slate-900 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column: Text & Stats */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
                  15 Years of <br/>
                  <span className="text-cyan-400">Excellence & Innovation</span>
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  At <strong>{COMPANY_NAME}</strong>, we don't just build websites; we engineer digital experiences that drive growth. Led by {DEVELOPER_NAME}, our Miami-based studio specializes in creating high-impact applications for startups, real estate, and enterprise clients.
                </p>
                <p className="text-slate-400 text-lg leading-relaxed">
                  From simple landing pages to complex trading platforms, every line of code is written with precision, ensuring scalability, security, and speed.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                <div>
                  <div className="flex items-center gap-3 mb-2 text-white font-bold text-3xl">
                    <Code className="text-cyan-400" />
                    <span>{PROJECTS.length}+</span>
                  </div>
                  <p className="text-slate-500 text-sm">Projects Delivered</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2 text-white font-bold text-3xl">
                    <Award className="text-yellow-500" />
                    <span>{EXPERIENCE_YEARS} Years</span>
                  </div>
                  <p className="text-slate-500 text-sm">Professional Experience</p>
                </div>
              </div>

              {/* Skills Chips (Moved from Right Col) */}
              <div className="pt-6">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Technologies</h3>
                 <div className="flex flex-wrap gap-2">
                    {RESUME_DATA.skills.slice(0, 10).map((tech) => (
                      <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm hover:border-cyan-500/50 transition-colors cursor-default">
                        {tech}
                      </span>
                    ))}
                  </div>
              </div>
            </div>
            
            {/* Right Column: Featured Portrait Image */}
            <div className="relative group">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
                 <img 
                    src={PROFILE_IMAGE} 
                    alt={DEVELOPER_NAME} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                 />
                 
                 {/* Elegant Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-8">
                   <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {/* Brand Watermark effect */}
                      <div className="mb-4 opacity-80">
                         <h4 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">
                            OMNIA ENGINE
                         </h4>
                      </div>
                      
                      <div className="w-12 h-1 bg-cyan-500 mb-4 rounded-full"></div>
                      
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-2 shadow-black drop-shadow-lg">
                        {DEVELOPER_NAME}
                      </h3>
                      <p className="text-cyan-400 font-medium tracking-widest uppercase text-sm">
                        CEO & Lead Architect
                      </p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-serif">Selected Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A collection of digital products and platforms engineered for performance and user engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 md:p-12 overflow-hidden relative">
             {/* Decorative glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6 font-serif">Let's work together</h2>
                <p className="text-slate-400 mb-8">
                  Ready to transform your digital presence? Visit our office in Brickell or reach out directly.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-cyan-400">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Headquarters</h4>
                      <p className="text-slate-400 text-sm">{CONTACT_INFO.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-green-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Phone</h4>
                      <a href={`tel:${CONTACT_INFO.phone}`} className="text-slate-400 text-sm hover:text-white transition-colors">
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-green-400">
                      <MessageCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">WhatsApp</h4>
                      <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="text-slate-400 text-sm hover:text-white transition-colors">
                        {CONTACT_INFO.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center text-center bg-slate-950/50 rounded-2xl p-8 border border-slate-800">
                <div className="w-16 h-16 rounded-full bg-slate-800 mb-4 flex items-center justify-center">
                  <Zap size={32} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Start a Project</h3>
                <p className="text-slate-400 text-sm mb-6">
                  We turn complex ideas into elegant, functional reality.
                </p>
                <a 
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-white text-slate-950 font-bold rounded-lg hover:bg-cyan-50 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-900 text-center text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.</p>
        <p className="mt-2">Designed & Developed by {DEVELOPER_NAME}.</p>
      </footer>

      {/* --- MODALS --- */}
      
      {/* Resume Modal */}
      {showCV && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up"
          onClick={closeModal}
        >
          <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 shadow-2xl relative flex flex-col">
            
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900/95 border-b border-slate-800 backdrop-blur">
               <div>
                  <h2 className="text-2xl font-bold text-white font-serif">{DEVELOPER_NAME}</h2>
                  <p className="text-cyan-400 text-sm">{TITLE}</p>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => window.print()} className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                   <Download size={20} />
                 </button>
                 <button onClick={() => setShowCV(false)} className="p-2 rounded-full bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors">
                   <X size={20} />
                 </button>
               </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 grid md:grid-cols-3 gap-8">
              {/* Sidebar */}
              <div className="space-y-8">
                 <div className="text-center md:text-left">
                    <img 
                      src={PROFILE_IMAGE} 
                      alt={DEVELOPER_NAME}
                      className="w-32 h-32 rounded-full object-cover border-4 border-slate-800 mx-auto md:mx-0 shadow-xl"
                    />
                 </div>
                 
                 <div>
                   <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                     <Mail size={16} className="text-cyan-500" /> Contact
                   </h3>
                   <ul className="space-y-2 text-sm text-slate-400">
                     <li>{CONTACT_INFO.email}</li>
                     <li>{CONTACT_INFO.phone}</li>
                     <li>{CONTACT_INFO.address}</li>
                     <li>Miami, FL</li>
                   </ul>
                 </div>

                 <div>
                   <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                     <Code size={16} className="text-cyan-500" /> Skills
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {RESUME_DATA.skills.map(skill => (
                       <span key={skill} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded border border-slate-700">
                         {skill}
                       </span>
                     ))}
                   </div>
                 </div>

                 <div>
                   <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                     <GraduationCap size={16} className="text-cyan-500" /> Education
                   </h3>
                   <div className="space-y-4">
                     {RESUME_DATA.education.map((edu, idx) => (
                       <div key={idx}>
                         <div className="text-white text-sm font-semibold">{edu.degree}</div>
                         <div className="text-slate-500 text-xs">{edu.school} • {edu.year}</div>
                       </div>
                     ))}
                   </div>
                 </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-2 space-y-8 border-l border-slate-800 md:pl-8">
                 <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                      <User size={20} className="text-cyan-500" /> Profile
                    </h3>
                    <p className="text-slate-400 leading-relaxed">
                      {RESUME_DATA.summary}
                    </p>
                 </div>

                 <div>
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Briefcase size={20} className="text-cyan-500" /> Experience
                    </h3>
                    <div className="space-y-8">
                      {RESUME_DATA.experience.map((exp, idx) => (
                        <div key={idx} className="relative pl-6 border-l-2 border-slate-800 hover:border-cyan-500/50 transition-colors">
                           <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-500"></div>
                           <h4 className="text-lg font-bold text-white">{exp.role}</h4>
                           <div className="text-cyan-400 text-sm mb-2 font-medium">{exp.company} | {exp.period}</div>
                           <p className="text-slate-400 text-sm leading-relaxed">
                             {exp.description}
                           </p>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Business Card Modal */}
      {showCard && (
         <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in-up"
          onClick={closeModal}
        >
          <div className="relative group perspective">
            {/* Close Button */}
            <button 
              onClick={() => setShowCard(false)}
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-cyan-400 transition-colors"
            >
              <X size={32} />
            </button>

            {/* Card Container */}
            <div className="w-[350px] md:w-[500px] h-[220px] md:h-[300px] relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-slate-900 border border-slate-700">
               {/* Background Effects */}
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
               
               {/* Content Grid */}
               <div className="relative z-10 h-full flex">
                 {/* Left Side: Photo & Identity */}
                 <div className="w-2/5 h-full bg-slate-950/50 backdrop-blur-sm border-r border-slate-800 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-blue-600 mb-4 shadow-lg">
                      <img 
                        src={PROFILE_IMAGE} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover border-2 border-slate-900"
                      />
                    </div>
                    <h2 className="text-white font-bold text-lg md:text-xl font-serif leading-tight">{DEVELOPER_NAME}</h2>
                    <p className="text-cyan-400 text-[10px] md:text-xs font-semibold mt-1 tracking-wider uppercase">CEO & Founder</p>
                 </div>

                 {/* Right Side: QR & Contact */}
                 <div className="w-3/5 h-full p-6 flex flex-col justify-between relative">
                    <div className="absolute top-4 right-4 opacity-20">
                      <div className="text-4xl font-serif font-bold text-white tracking-widest">OMNIA</div>
                    </div>

                    <div className="mt-8 md:mt-10 flex gap-4">
                       <div className="p-2 bg-white rounded-lg shadow-lg">
                         <img 
                           src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(CONTACT_INFO.website)}`}
                           alt="QR Code" 
                           className="w-20 h-20 md:w-24 md:h-24"
                         />
                       </div>
                       <div className="flex flex-col justify-center space-y-2 text-xs md:text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                             <Phone size={12} className="text-cyan-500" />
                             <span>{CONTACT_INFO.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Mail size={12} className="text-cyan-500" />
                             <span className="truncate w-32">{CONTACT_INFO.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <Globe size={12} className="text-cyan-500" />
                             <span>omnia.tech</span>
                          </div>
                       </div>
                    </div>

                    <div className="text-[10px] text-slate-600 text-center uppercase tracking-[0.2em]">
                      Luxury Software Development
                    </div>
                 </div>
               </div>
            </div>
            
            {/* Download/Share Actions */}
            <div className="mt-6 flex justify-center gap-4">
              <a 
                href={CONTACT_INFO.whatsappUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full text-sm font-semibold shadow-lg transition-all"
              >
                <MessageCircle size={16} />
                WhatsApp Me
              </a>
               <button 
                className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-semibold shadow-lg border border-slate-700 transition-all"
                onClick={() => alert("Contact added to contacts (Mock Action)")}
              >
                <Share2 size={16} />
                Save Contact
              </button>
            </div>
          </div>
         </div>
      )}
    </div>
  );
}

export default App;