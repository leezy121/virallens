import { supabase } from './supabase'

interface DecodeRequest {
  viralLink: string
  viralScript: string
}

interface DiagnoseRequest {
  viralLink: string
  viralScript: string
  userLink: string
  userScript: string
}

interface CoachRequest {
  messages: { role: string; content: string }[]
}

export async function decodeVideo(data: DecodeRequest) {
  const { data: result, error } = await supabase.functions.invoke('decode-video', {
    body: data,
  })
  if (error) throw error
  return result
}

export async function diagnoseFlop(data: DiagnoseRequest) {
  const { data: result, error } = await supabase.functions.invoke('diagnose-flop', {
    body: data,
  })
  if (error) throw error
  return result
}

export async function chatWithCoach(data: CoachRequest) {
  const { data: result, error } = await supabase.functions.invoke('coach-chat', {
    body: data,
  })
  if (error) throw error
  return result
}
