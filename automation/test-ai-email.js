// 🧪 TEST AI EMAIL GENERATION
// Preview emails generados con OpenAI antes de enviar

import { generatePersonalizedEmail } from './openai-personalizer.js';
import { researchLead, enrichLeadWithResearch } from './lead-researcher.js';

// Lead de prueba (puedes cambiar estos datos)
const testLead = {
  id: 'test-001',
  name: 'María García',
  email: 'maria@example.com',
  company: 'TechStore MX',
  industry: 'E-commerce',
  job_title: 'CEO',
  tier: 1,
  website: 'https://techstore.mx',
  sequence_step: 0,
  resurrection_count: 0
};

// Tipos de email a probar
const emailTypes = ['detective', 'resource', 'demo', 'case', 'question', 'friend'];

async function testAllEmails() {
  console.log('🧪 TEST DE EMAILS CON AI PERSONALIZATION\n');
  console.log('=' .repeat(60));
  console.log(`Lead: ${testLead.name} - ${testLead.company} (${testLead.industry})`);
  console.log('=' .repeat(60));
  
  // Investigar lead primero
  console.log('\n🔍 Investigando lead...\n');
  const research = await researchLead(testLead);
  const enrichedLead = enrichLeadWithResearch(testLead, research);
  
  console.log('📋 Research Results:');
  console.log(`   Problemas detectados: ${research.detectedProblems.join(', ')}`);
  console.log(`   Ángulo personalizado: ${research.personalizedAngle}`);
  console.log('\n');
  
  // Generar cada tipo de email
  for (const type of emailTypes) {
    console.log('─'.repeat(60));
    console.log(`\n📧 EMAIL: ${type.toUpperCase()}\n`);
    
    try {
      const email = await generatePersonalizedEmail(enrichedLead, type, research);
      
      console.log(`Subject: ${email.subject}`);
      console.log('─'.repeat(40));
      console.log(email.body);
      console.log('\n');
    } catch (error) {
      console.error(`Error generando ${type}: ${error.message}`);
    }
    
    // Esperar entre llamadas para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('=' .repeat(60));
  console.log('✅ Test completado');
}

async function testSingleEmail(type = 'detective') {
  console.log(`\n🧪 Testing ${type} email for ${testLead.name}...\n`);
  
  const research = await researchLead(testLead);
  const enrichedLead = enrichLeadWithResearch(testLead, research);
  
  const email = await generatePersonalizedEmail(enrichedLead, type, research);
  
  console.log('─'.repeat(50));
  console.log(`Subject: ${email.subject}`);
  console.log('─'.repeat(50));
  console.log(email.body);
  console.log('─'.repeat(50));
}

// Obtener argumento de línea de comandos
const arg = process.argv[2];

if (arg && emailTypes.includes(arg)) {
  testSingleEmail(arg).catch(console.error);
} else if (arg === 'all') {
  testAllEmails().catch(console.error);
} else {
  console.log('Uso:');
  console.log('  npm run test-ai           # Probar email "detective" (inicial)');
  console.log('  npm run test-ai detective # Probar email específico');
  console.log('  npm run test-ai all       # Probar toda la secuencia');
  console.log('\nTipos disponibles:', emailTypes.join(', '));
  console.log('\nEjecutando test de email "detective"...\n');
  testSingleEmail('detective').catch(console.error);
}
