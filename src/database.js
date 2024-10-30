import { createClient } from '@supabase/supabase-js';

async function initializeSupabase() {
	try {
		const response = await fetch('/supabase-config');
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const { supabaseUrl, supabaseKey } = await response.json();

		if (!supabaseUrl || !supabaseKey) {
			throw new Error('Supabase configuration is incomplete');
		}

		return createClient(supabaseUrl, supabaseKey);
	} catch (error) {
		const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
		const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

		if (supabaseUrl && supabaseKey) {
			return createClient(supabaseUrl, supabaseKey);
		}
		throw error;
	}
}

const supabase = await initializeSupabase();

export default supabase;
