#!/usr/bin/env node

/**
 * Verify Screenshot API Configuration
 * 
 * This script checks if your API keys are properly configured
 */

const fs = require('fs')
const path = require('path')

const ENV_FILE = path.join(__dirname, '.env.local')

console.log('🔍 Verifying Screenshot API configuration...\n')

// Check if .env.local exists
if (!fs.existsSync(ENV_FILE)) {
    console.log('❌ .env.local file not found')
    console.log('   Run: node setup-api-key.js\n')
    process.exit(1)
}

// Read .env.local
const envContent = fs.readFileSync(ENV_FILE, 'utf8')

// Check for required keys
const hasClientKey = envContent.includes('NEXT_PUBLIC_SCREENSHOT_API_KEY=')
const hasServerKey = envContent.includes('SCREENSHOT_API_KEY=')

// Extract key values
const clientKeyMatch = envContent.match(/NEXT_PUBLIC_SCREENSHOT_API_KEY=(.+)/)
const serverKeyMatch = envContent.match(/^SCREENSHOT_API_KEY=(.+)/m)

const clientKey = clientKeyMatch ? clientKeyMatch[1].trim() : null
const serverKey = serverKeyMatch ? serverKeyMatch[1].trim() : null

console.log('Configuration Status:')
console.log('─────────────────────────────────────────\n')

// Client key check
if (hasClientKey && clientKey && clientKey.length > 0) {
    console.log('✅ NEXT_PUBLIC_SCREENSHOT_API_KEY: Found')
    console.log(`   Length: ${clientKey.length} characters`)
    console.log(`   Preview: ${clientKey.substring(0, 16)}...`)
} else {
    console.log('❌ NEXT_PUBLIC_SCREENSHOT_API_KEY: Missing or empty')
}

console.log()

// Server key check
if (hasServerKey && serverKey && serverKey.length > 0) {
    console.log('✅ SCREENSHOT_API_KEY: Found')
    console.log(`   Length: ${serverKey.length} characters`)
    console.log(`   Preview: ${serverKey.substring(0, 16)}...`)
} else {
    console.log('❌ SCREENSHOT_API_KEY: Missing or empty')
}

console.log()

// Check if keys match
if (clientKey && serverKey) {
    if (clientKey === serverKey) {
        console.log('✅ Keys match (client and server)')
    } else {
        console.log('⚠️  Keys DO NOT match!')
        console.log('   Client and server keys must be identical')
    }
}

console.log('\n─────────────────────────────────────────')

// Final verdict
if (hasClientKey && hasServerKey && clientKey && serverKey && clientKey === serverKey) {
    console.log('\n✅ Configuration is valid!\n')
    console.log('Next steps:')
    console.log('1. Restart your dev server: npm run dev')
    console.log('2. Test the API by taking a screenshot\n')
    process.exit(0)
} else {
    console.log('\n❌ Configuration has issues\n')
    console.log('Fix by running: node setup-api-key.js\n')
    process.exit(1)
}
