export async function onRequest(context) {
    const supabaseConfig = {
      supabaseUrl: context.env.SUPABASE_URL,
      supabaseKey: context.env.SUPABASE_KEY
    };
  
    return new Response(JSON.stringify(supabaseConfig), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }