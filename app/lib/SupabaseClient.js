import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY

// Validate environment variables
if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required. Please check your .env.local file.')
}

if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required. Please check your .env.local file.')
}

console.log('✅ Supabase environment variables loaded:')
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing')
console.log('Service Key:', supabaseServiceKey ? '✅ Set' : '❌ Missing')

// Create regular client (for user operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('✅ Regular Supabase client created')

// Create admin client (for admin operations) - only if service key is available
export const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null
if (supabaseServiceKey) {
    console.log('✅ Admin Supabase client created')
} else {
    console.warn('⚠️ Service role key not available - admin functions will not work')
}

// Test connection function
export const testConnection = async () => {
    try {
        console.log('🔍 Testing Supabase connection...')
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
            console.error('❌ Connection test failed:', error.message)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Connection test successful')
        return { success: true, data }
    } catch (error) {
        console.error('❌ Connection test error:', error.message)
        return { success: false, error: error.message }
    }
}