#!/usr/bin/env node

/**
 * Fix API Key Mismatch
 * 
 * This script ensures both API keys match in .env.local
 */

const fs = require('fs')
const path = require('path')

const ENV_FILE = path.join(__dirname, '.env.local')

console.log('🔧 Fixing API key mismatch...\n')

if (!fs.existsSync(ENV_FILE)) {
    console.log('❌ .env.local file not found\n')
    process.exit(1)
}

// Read .env.local
let envContent = fs.readFileSync(ENV_FILE, 'utf8')

// Extract client key (this is the one we want to use)
const clientKeyMatch = envContent.match(/NEXT_PUBLIC_SCREENSHOT_API_KEY=(.+)/)
const clientKey = clientKeyMatch ? clientKeyMatch[1].trim() : null

if (!clientKey) {
    console.log('❌ NEXT_PUBLIC_SCREENSHOT_API_KEY not found\n')
    process.exit(1)
}

console.log('✓ Found client key:', clientKey.substring(0, 16) + '...')

// Update or add server key to match client key
if (envContent.includes('SCREENSHOT_API_KEY=')) {
    // Replace existing server key
    envContent = envContent.replace(
        /^SCREENSHOT_API_KEY=.+$/m,
        `SCREENSHOT_API_KEY=${clientKey}`
    )
    console.log('✓ Updated SCREENSHOT_API_KEY to match client key')
} else {
    // Add server key
    envContent += `\n# Server-side API key (must match client key)\nSCREENSHOT_API_KEY=${clientKey}\n`
    console.log('✓ Added SCREENSHOT_API_KEY')
}

// Write back
fs.writeFileSync(ENV_FILE, envContent, 'utf8')

console.log('\n✅ API keys are now synchronized!\n')
console.log('⚠️  IMPORTANT: Restart your development server:')
console.log('   1. Stop the current server (Ctrl+C)')
console.log('   2. Run: npm run dev\n')
