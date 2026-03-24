import { supabase } from './supabase'

export const COSTS = {
  decode: 2,
  diagnose: 2,
  coach: 1,
} as const

export async function getCredits(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data?.credits ?? 0
}

export async function deductCredits(userId: string, amount: number, description: string): Promise<boolean> {
  const credits = await getCredits(userId)
  if (credits < amount) return false

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits: credits - amount, updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (updateError) throw updateError

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    type: 'usage',
    description,
  })

  return true
}

export async function addCredits(userId: string, amount: number, description: string): Promise<void> {
  const credits = await getCredits(userId)
  const { error } = await supabase
    .from('profiles')
    .update({ credits: credits + amount, updated_at: new Date().toISOString() })
    .eq('id', userId)
  if (error) throw error

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    type: 'purchase',
    description,
  })
}
