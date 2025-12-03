#!/usr/bin/env node

/**
 * Setup Script for Screenshot API Key
 * 
 * This script adds the required API keys to your .env.local file
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const ENV_FILE = path.join(__dirname, '.env.local')

// Generate a secure API key
const apiKey = '451164d4ee9ddef3a747c63ac68e1a1359286710eb0f54fde24a67b2148f898f'

console.log('🔧 Setting up Screenshot API keys...\n')

// Read existing .env.local file
let envContent = ''
if (fs.existsSync(ENV_FILE)) {
    envContent = fs.readFileSync(ENV_FILE, 'utf8')
    console.log('✓ Found existing .env.local file')
} else {
    console.log('✓ Creating new .env.local file')
}

// Check if keys already exist
const hasClientKey = envContent.includes('NEXT_PUBLIC_SCREENSHOT_API_KEY=')
const hasServerKey = envContent.includes('SCREENSHOT_API_KEY=')

if (hasClientKey && hasServerKey) {
    console.log('\n⚠️  API keys already exist in .env.local')
    console.log('   If you want to regenerate them, please remove the existing keys first.\n')
    process.exit(0)
}

// Add API keys
let newContent = envContent

if (!newContent.includes('# Screenshot API Configuration')) {
    newContent += '\n# ============================================\n'
    newContent += '# Screenshot API Configuration\n'
    newContent += '# ============================================\n\n'
}

if (!hasClientKey) {
    newContent += `# Client-side API key (exposed to browser)\n`
    newContent += `NEXT_PUBLIC_SCREENSHOT_API_KEY=${apiKey}\n\n`
    console.log('✓ Added NEXT_PUBLIC_SCREENSHOT_API_KEY')
}

if (!hasServerKey) {
    newContent += `# Server-side API key (NOT exposed to browser)\n`
    newContent += `SCREENSHOT_API_KEY=${apiKey}\n\n`
    console.log('✓ Added SCREENSHOT_API_KEY')
}

// Write back to file
fs.writeFileSync(ENV_FILE, newContent, 'utf8')

console.log('\n✅ Setup complete!\n')
console.log('📋 API Key (first 16 chars):', apiKey.substring(0, 16) + '...')
console.log('\n⚠️  IMPORTANT: Restart your development server:')
console.log('   npm run dev\n')
