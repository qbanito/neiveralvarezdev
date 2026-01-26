import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Mail, ChevronDown, Code, Zap, Globe, Award, QrCode, FileText, X, Download, Share2, Briefcase, GraduationCap, User, Check, Star, ChevronRight, Send, Building2, Brain, Calendar, Linkedin } from 'lucide-react';
import { PROJECTS, CONTACT_INFO, EXPERIENCE_YEARS, COMPANY_NAME, DEVELOPER_NAME, RESUME_DATA, TITLE, PROFILE_IMAGE, SERVICES, TESTIMONIALS, FAQS, PROCESS_STEPS } from './constants';
import { ProjectCard } from './components/ProjectCard';

function App() {
  const [showCV, setShowCV] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
    budget: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  // Helper to close modals
  const closeModal = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowCV(false);
      setShowCard(false);
    }
  };

  // Form handlers
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Lead enviado:', data);
        setFormStatus('success');
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({ name: '', email: '', company: '', service: '', message: '', budget: '' });
          setFormStatus('idle');
        }, 3000);
      } else {
        console.error('❌ Error:', data);
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 3000);
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
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
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
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950 -z-10"></div>
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[150px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] -z-10 animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[200px] -z-10" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10 opacity-20"></div>

        <div className="container mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-cyan-400 text-xs font-semibold tracking-wider mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            AVAILABLE FOR NEW PROJECTS
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-8 font-serif tracking-tight animate-fade-in-up leading-none" style={{ animationDelay: '0.1s' }}>
            Crafting Digital <br />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x">
                Excellence
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 blur-3xl opacity-30 -z-10"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Building <span className="text-cyan-400 font-bold">enterprise-grade applications</span> that transform businesses. <br/>
            Led by <strong className="text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{DEVELOPER_NAME}</strong>, powered by {COMPANY_NAME}.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <a
              href={CONTACT_INFO.calendly}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-400/70 hover:-translate-y-2 hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Calendar size={20} className="relative z-10" />
              <span className="relative z-10">Schedule Call</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-0 bg-white/20 blur-xl"></div>
              </div>
            </a>
            <button
              onClick={() => setShowCard(true)}
              className="group flex items-center gap-3 px-10 py-4 rounded-full bg-slate-900/50 border-2 border-slate-700 text-white font-bold hover:bg-slate-800 hover:border-cyan-500 hover:-translate-y-1 transition-all backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <QrCode size={20} />
              <span>Digital Card</span>
            </button>
            <button
              onClick={() => setShowCV(true)}
              className="group flex items-center gap-3 px-10 py-4 rounded-full bg-slate-900/50 border-2 border-slate-700 text-white font-bold hover:bg-slate-800 hover:border-blue-500 hover:-translate-y-1 transition-all backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-blue-500/20"
            >
              <FileText size={20} />
              <span>View Resume</span>
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
      <section id="projects" className="relative py-32 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="container max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent font-serif">
              Featured Work
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              A curated selection of projects that showcase innovation, technical excellence, and real-world impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent font-serif">
              Our Proven Process
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              A battle-tested methodology that consistently delivers excellence
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.id} className="relative flex gap-6 pb-12 last:pb-0">
                {/* Timeline line */}
                {index !== PROCESS_STEPS.length - 1 && (
                  <div className="absolute left-6 top-14 w-0.5 h-full bg-slate-800"></div>
                )}
                
                {/* Step number circle */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20 relative z-10">
                  {step.id}
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{step.title}</h3>
                    <span className="text-cyan-400 text-sm font-semibold">{step.duration}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Pricing */}
      <section id="services" className="relative py-32 bg-slate-950 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent font-serif">
              Premium Services
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Elite digital solutions engineered for maximum impact and scalability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {SERVICES.map((service) => {
              const IconComponent = service.icon === 'Globe' ? Globe : service.icon === 'Building2' ? Building2 : Brain;
              return (
                <div 
                  key={service.id}
                  className={`relative group bg-gradient-to-br from-slate-950/95 to-slate-900/95 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl overflow-hidden ${
                    service.popular 
                      ? 'border-cyan-500 shadow-lg shadow-cyan-500/30' 
                      : 'border-slate-800 hover:border-cyan-500/30 hover:shadow-cyan-500/10'
                  }`}
                >
                  {service.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-white text-xs font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/50 transition-colors">
                    <IconComponent size={28} className="text-cyan-400" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 font-serif">{service.name}</h3>
                  <p className="text-slate-400 mb-6 leading-relaxed">{service.description}</p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                        <Check size={16} className="text-cyan-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6 border-t border-slate-800">
                    <div className="text-2xl font-bold text-white mb-4">{service.price}</div>
                    <a 
                      href="#contact-form"
                      className="block w-full py-3 px-6 text-center rounded-lg bg-slate-800 hover:bg-cyan-500 text-white font-semibold transition-colors"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 bg-slate-950 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent font-serif">
              Client Testimonials
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Success stories from visionaries we've partnered with
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {TESTIMONIALS.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="group relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl rounded-2xl p-8 border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                {/* Rating stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                
                {/* Testimonial text */}
                <p className="text-slate-300 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                
                {/* Client info */}
                <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-32 bg-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent font-serif">
              FAQ
            </h2>
            <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about working with OMNIA
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {FAQS.map((faq) => (
              <div 
                key={faq.id}
                className="group bg-gradient-to-br from-slate-950/95 to-slate-900/95 backdrop-blur-xl rounded-2xl border-2 border-slate-800 overflow-hidden hover:border-cyan-500/30 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-900/50 transition-colors"
                >
                  <span className="text-white font-semibold pr-8">{faq.question}</span>
                  <ChevronRight 
                    size={20} 
                    className={`text-cyan-400 flex-shrink-0 transition-transform ${expandedFAQ === faq.id ? 'rotate-90' : ''}`}
                  />
                </button>
                
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-slate-800 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="relative py-32 bg-slate-950 overflow-hidden">
        {/* Dramatic Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950 to-slate-950"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent font-serif">
                Let's Build Together
              </h2>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto leading-relaxed">
                Tell us your vision, and we'll architect the solution
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border-2 border-slate-800 shadow-2xl overflow-hidden">
              {/* Decorative glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-white font-semibold mb-2">Full Name *</label>
                  <input 
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-white font-semibold mb-2">Email *</label>
                  <input 
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="company" className="block text-white font-semibold mb-2">Company</label>
                  <input 
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                    placeholder="Your Company"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-white font-semibold mb-2">Service Interest *</label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="web">Web Development</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="ai">AI Integration</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="budget" className="block text-white font-semibold mb-2">Budget Range</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors"
                >
                  <option value="">Select budget range</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-white font-semibold mb-2">Project Details *</label>
                <textarea 
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your project, timeline, and any specific requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending' || formStatus === 'success'}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  formStatus === 'success' 
                    ? 'bg-green-600 text-white' 
                    : formStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : formStatus === 'sending'
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20'
                }`}
              >
                {formStatus === 'sending' && 'Sending...'}
                {formStatus === 'success' && (
                  <>
                    <Check size={20} />
                    Message Sent!
                  </>
                )}
                {formStatus === 'error' && (
                  <>
                    <X size={20} />
                    Send Failed
                  </>
                )}
                {formStatus === 'idle' && (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>

              {formStatus === 'success' && (
                <p className="text-center text-green-400 mt-4 text-sm">
                  Thanks! We'll respond within the next 24 hours. Check your email.
                </p>
              )}
              {formStatus === 'error' && (
                <p className="text-center text-red-400 mt-4 text-sm">
                  Error sending. Please try again or contact us via WhatsApp.
                </p>
              )}
            </form>
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
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-red-400">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Email</h4>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-slate-400 text-sm hover:text-white transition-colors block">
                        {CONTACT_INFO.email}
                      </a>
                      <a href={`mailto:${CONTACT_INFO.emailBusiness}`} className="text-slate-400 text-sm hover:text-white transition-colors block">
                        {CONTACT_INFO.emailBusiness}
                      </a>
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

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Linkedin size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">LinkedIn</h4>
                      <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 text-sm hover:text-white transition-colors">
                        Connect on LinkedIn
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 text-purple-400">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">Schedule Meeting</h4>
                      <a href={CONTACT_INFO.calendly} target="_blank" rel="noreferrer" className="text-slate-400 text-sm hover:text-white transition-colors">
                        Book a consultation
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

      {/* Sticky CTA Button */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href="#contact-form"
          className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full shadow-2xl shadow-cyan-500/30 transition-all hover:scale-105 font-bold"
        >
          <Send size={20} />
          <span className="hidden md:inline">Get Quote</span>
        </a>
        
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-105"
        >
          <MessageCircle size={24} />
        </a>
      </div>

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
                     <li>{CONTACT_INFO.emailBusiness}</li>
                     <li>{CONTACT_INFO.phone}</li>
                     <li className="break-words">
                       <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">
                         LinkedIn Profile
                       </a>
                     </li>
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

            {/* Card Container - Made wider */}
            <div className="w-full max-w-[900px] h-auto relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-slate-900 border border-slate-700">
               {/* Background Effects */}
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-gradient-to-tr from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
               
               {/* Content */}
               <div className="relative z-10 p-8 md:p-12">
                 {/* Header */}
                 <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800">
                   <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-blue-600 shadow-xl flex-shrink-0">
                     <img 
                       src={PROFILE_IMAGE} 
                       alt="Profile" 
                       className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                     />
                   </div>
                   <div className="flex-1">
                     <h2 className="text-white font-bold text-3xl md:text-4xl font-serif leading-tight mb-2">{DEVELOPER_NAME}</h2>
                     <p className="text-cyan-400 text-sm md:text-base font-semibold tracking-wider uppercase mb-3">CEO & Lead Architect</p>
                     <div className="text-2xl font-serif font-bold text-white tracking-widest opacity-60">OMNIA</div>
                   </div>
                   {/* QR Code */}
                   <div className="hidden md:block flex-shrink-0">
                     <div className="p-3 bg-white rounded-xl shadow-xl">
                       <img 
                         src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(CONTACT_INFO.linkedin)}`}
                         alt="QR Code" 
                         className="w-28 h-28"
                       />
                     </div>
                     <p className="text-xs text-center text-slate-500 mt-2">Scan to connect</p>
                   </div>
                 </div>

                 {/* Contact Information Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Left Column */}
                   <div className="space-y-4">
                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <Mail size={20} className="text-cyan-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Email</p>
                         <a href={`mailto:${CONTACT_INFO.email}`} className="text-white hover:text-cyan-400 transition-colors text-sm md:text-base break-all">
                           {CONTACT_INFO.email}
                         </a>
                         <a href={`mailto:${CONTACT_INFO.emailBusiness}`} className="text-white hover:text-cyan-400 transition-colors text-sm md:text-base break-all block mt-1">
                           {CONTACT_INFO.emailBusiness}
                         </a>
                       </div>
                     </div>

                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <Phone size={20} className="text-green-400" />
                       </div>
                       <div className="flex-1">
                         <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Phone</p>
                         <a href={`tel:${CONTACT_INFO.phone}`} className="text-white hover:text-cyan-400 transition-colors text-sm md:text-base">
                           {CONTACT_INFO.phone}
                         </a>
                       </div>
                     </div>

                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <MessageCircle size={20} className="text-green-500" />
                       </div>
                       <div className="flex-1">
                         <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">WhatsApp</p>
                         <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noreferrer" className="text-white hover:text-cyan-400 transition-colors text-sm md:text-base">
                           {CONTACT_INFO.whatsapp}
                         </a>
                       </div>
                     </div>
                   </div>

                   {/* Right Column */}
                   <div className="space-y-4">
                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <Linkedin size={20} className="text-blue-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">LinkedIn</p>
                         <a href={CONTACT_INFO.linkedin} target="_blank" rel="noreferrer" className="text-white hover:text-cyan-400 transition-colors text-sm md:text-base break-all">
                           linkedin.com/in/neiveralvarez
                         </a>
                       </div>
                     </div>

                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <Calendar size={20} className="text-purple-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Schedule Meeting</p>
                         <a href={CONTACT_INFO.calendly} target="_blank" rel="noreferrer" className="text-white hover:text-cyan-400 transition-colors text-sm md:text-base break-all">
                           calendly.com/convoycubano
                         </a>
                       </div>
                     </div>

                     <div className="flex items-start gap-3">
                       <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                         <MapPin size={20} className="text-cyan-400" />
                       </div>
                       <div className="flex-1">
                         <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Location</p>
                         <p className="text-white text-sm md:text-base">
                           {CONTACT_INFO.address}
                         </p>
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Mobile QR Code */}
                 <div className="md:hidden mt-8 pt-8 border-t border-slate-800 flex justify-center">
                   <div>
                     <div className="p-3 bg-white rounded-xl shadow-xl inline-block">
                       <img 
                         src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(CONTACT_INFO.linkedin)}`}
                         alt="QR Code" 
                         className="w-32 h-32"
                       />
                     </div>
                     <p className="text-xs text-center text-slate-500 mt-2">Scan to connect</p>
                   </div>
                 </div>

                 {/* Footer Tagline */}
                 <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                   <p className="text-slate-500 text-sm uppercase tracking-[0.3em]">Luxury Software Development</p>
                 </div>
               </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a 
                href={CONTACT_INFO.whatsappUrl} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full text-sm font-semibold shadow-lg transition-all"
              >
                <MessageCircle size={16} />
                WhatsApp Me
              </a>
              <a 
                href={CONTACT_INFO.calendly} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm font-semibold shadow-lg transition-all"
              >
                <Calendar size={16} />
                Book Meeting
              </a>
              <a 
                href={CONTACT_INFO.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold shadow-lg transition-all"
              >
                <Linkedin size={16} />
                Connect
              </a>
            </div>
          </div>
         </div>
      )}
    </div>
  );
}

export default App;