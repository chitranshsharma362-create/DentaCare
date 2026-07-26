const supabaseClient = window.supabase.createClient(
  "https://ouxwchmiehuzzheyqhzo.supabase.co",
  "sb_publishable_y3WNyk27uzl_PoXevfwg4g_0ySSryBB"
  );

if (supabaseClient) {
  console.log("Database connected:", supabaseClient);
} else{
  console.log("Database not connected");
}
