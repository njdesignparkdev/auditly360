#!/usr/bin/env node

/**
 * Update Client Key to Match Server Key
 * 
 * Updates NEXT_PUBLIC_SCREENSHOT_API_KEY to match the existing SCREENSHOT_API_KEY
 */

const fs = require('fs')
const path = require('path')

const ENV_FILE = path.join(__dirname, '.env.local')
const SERVER_KEY = '61ca4518b42ea18a1e1cfb1e0da9749b3ff337d498a5db6d38b95b3fe40d1800'

console.log('🔧 Updating client key to match server key...\n')

if (!fs.existsSync(ENV_FILE)) {
    console.log('❌ .env.local file not found\n')
    process.exit(1)
}

// Read .env.local
let envContent = fs.readFileSync(ENV_FILE, 'utf8')

console.log('✓ Using server key:', SERVER_KEY.substring(0, 16) + '...')

// Update client key to match server key
if (envContent.includes('NEXT_PUBLIC_SCREENSHOT_API_KEY=')) {
    envContent = envContent.replace(
        /NEXT_PUBLIC_SCREENSHOT_API_KEY=.+/,
        `NEXT_PUBLIC_SCREENSHOT_API_KEY=${SERVER_KEY}`
    )
    console.log('✓ Updated NEXT_PUBLIC_SCREENSHOT_API_KEY to match server key')
} else {
    // Add client key
    envContent += `\n# Client-side API key (must match server key)\nNEXT_PUBLIC_SCREENSHOT_API_KEY=${SERVER_KEY}\n`
    console.log('✓ Added NEXT_PUBLIC_SCREENSHOT_API_KEY')
}

// Ensure server key is also set correctly
if (!envContent.includes('SCREENSHOT_API_KEY=')) {
    envContent += `\n# Server-side API key\nSCREENSHOT_API_KEY=${SERVER_KEY}\n`
    console.log('✓ Added SCREENSHOT_API_KEY')
}

// Write back
fs.writeFileSync(ENV_FILE, envContent, 'utf8')

console.log('\n✅ Keys are now synchronized!\n')
console.log('Configuration:')
console.log('  NEXT_PUBLIC_SCREENSHOT_API_KEY = ' + SERVER_KEY.substring(0, 16) + '...')
console.log('  SCREENSHOT_API_KEY             = ' + SERVER_KEY.substring(0, 16) + '...')
console.log('\n⚠️  IMPORTANT: Restart your development server:')
console.log('   1. Stop the current server (Ctrl+C)')
console.log('   2. Run: npm run dev\n')
