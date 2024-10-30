import { createClient } from '@supabase/supabase-js';

async function initializeSupabase() {
	const response = await fetch('../functions/supabase-config');
	try {
		const { supabaseUrl, supabaseKey } = await response.json();

		if (!response.supabaseUrl || !response.supabaseKey) {
			throw new Error('Supabase configuration is incomplete');
		}

		return createClient(supabaseUrl, supabaseKey);
	} catch (error) {
		const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
		const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

		return createClient(supabaseUrl, supabaseKey);
	}
}

const supabase = await initializeSupabase();

export default supabase;
