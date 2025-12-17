'use server'

import { createClient } from '../supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function register(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string


  if (!email || !password) {
    return { error: 'Email dan password harus diisi' }
  }

  if (password.length < 5) {
    return { error: 'Password minimal 6 karakter' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login')
}

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  
  if (!email || !password) {
    return { error: 'Email dan password harus diisi' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
