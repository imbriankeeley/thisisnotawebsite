export async function onRequest(context) {
    const supabaseConfig = {
      supabaseUrl: context.env.LIVE_SUPABASE_URL,
      supabaseKey: context.env.LIVE_SUPABASE_KEY
    };
  
    return new Response(JSON.stringify(supabaseConfig), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }