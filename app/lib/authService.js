import {supabase, supabaseAdmin} from '@/app/lib/SupabaseClient' 




// All Manual Signup 

// Function to check if email is already in use 
export const checkEmail = async(email) =>{
    try {
        // Use admin client for checking users
        if (!supabaseAdmin) {
            console.warn('Admin client not available for email check - skipping email validation')
            return {exists: false, verified: false}
        }
        
        const {data:users, error} = await supabaseAdmin.auth.admin.listUsers() 
        if (error){
            console.error('Error checking email:', error)
            return {error: error.message}
        }
        
        const user = users.users.find(user=> user.email === email) 
        if (user){
            return {exists: true, verified: user.email_confirmed_at !== null}
        }
        return {exists: false, verified: false}
    } catch(error){
        console.error('CheckEmail error:', error)
        return {error: error.message}
    }
}

// Function to Resend Verification Email 
export const resendVerificationEmail = async(email) =>{
    try{
        console.log('Resending verification email to:', email)
        const {data, error} = await supabase.auth.resend({
            type: "signup",
            email: email,
            options:{
                emailRedirectTo: window.location.origin + '/'
            }
        })
        
        if (error){
            console.error('Resend error:', error)
            throw new Error(error.message)
        }
        
        console.log('Resend successful:', data)
        return {success: true, message: "Verification email sent successfully"}
    } catch(error){
        console.error('Resend error:', error)
        return {success: false, message: error.message}
    }
}
// User Details Extraction from verify token 
export const TokenUserDetails = async(token,type)=>{
    try{
        const {data,error} = await supabase.auth.verifyOtp({
            token_hash: token,
            type:type
        })
        if (error){
            throw new Error(error.message)
        }
        if (data.user){
            return {status:true,user:data.user}
        }
        else {
            return {status:false}
        }
    }catch(error){
        return {status:false}
    }
}

// Send verification email from create account page
export const EmailSignup = async(userData) => {
    try {
       
        
        // Validate input
        if (!userData.email || !userData.password) {
            throw new Error('Email and password are required')
        }
        
        if (userData.password.length < 6) {
            throw new Error('Password must be at least 6 characters')
        }
        
        // Step 1: Test basic connection
        console.log('🔍 Step 1: Testing connection...')
        const { data: testData, error: testError } = await supabase.auth.getSession()
        console.log('✅ Connection test:', testError ? testError.message : 'Success')
        
        // Step 2: Attempt signup
        console.log('🔍 Step 2: Starting signup...')
        const {data, error} = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options:{
                emailRedirectTo: window.location.origin + '/',
                data:{
                    email: userData.email,
                    full_name: userData.full_name,
                    agree_to_terms: userData.agree_to_terms,
                    newsletter: userData.newsletter
                }
            }
        })
     
        
        if (error){
    
            
            // Handle specific error cases
            if (error.message.includes('Email already in use')) {
                return {
                    success: false,
                    message: "An account with this email already exists. Please try logging in instead.",
                    userExists: true
                }
            }
            
            throw new Error(error.message) 
        }
        
        // Step 4: Check response
        if (data.user && !data.session) {
            console.log('✅ Signup successful - email confirmation required')
            return {
                success: true, 
                message: "Please check your email to confirm your account before signing in.",
                requiresConfirmation: true,
                user: data.user
            }
        }
        
        if (data.user && data.session) {
            console.log('✅ Signup successful - user logged in')
            return {
                success: true,
                message: "Account created successfully!",
                user: data.user,
                session: data.session
            }
        }
        
        console.log('❌ Unexpected response format')
        return {
            success: false,
            message: "Something went wrong during signup"
        }
        
    } catch (error) {
        console.error('💥 EmailSignup error:', error)
        console.error('💥 Error type:', error.constructor.name)
        console.error('💥 Error message:', error.message)
        console.error('💥 Error stack:', error.stack)
        
        // Handle specific error types
        if (error.message.includes('Failed to fetch')) {
            return {
                success: false,
                message: "Network error. Please check your internet connection and try again."
            }
        }
        
        return {
            success: false,
            message: error.message || "An unexpected error occurred. Please try again."
        }
    }
}
