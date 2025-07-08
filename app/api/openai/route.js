import OpenAI from 'openai'
import {NextResponse} from 'next/server'

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI,
})

export async function POST(req){
    
    try{
        const {messages,model="gpt-3.5-turbo"} = await req.json() 
        const completion = await openai.chat.completions.create({
            model,
            messages,
            max_tokens:1000,
            temperature:1.2 ,
            stream:false
        })
        const response = completion.choices[0].message.content
        return NextResponse.json({status:true,response})
    }
    catch(error){
        console.error(error)
        return NextResponse.json({status:false,error:error.message},
            {status:500}
        )
    }
    
}