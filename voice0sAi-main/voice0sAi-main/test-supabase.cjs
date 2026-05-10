const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  'https://cpnmxetvctncfecrvacq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbm14ZXR2Y3RuY2ZlY3J2YWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNTY3MjYsImV4cCI6MjA1NzkzMjc0Nn0.Wb0k9dL4W9sNfhU8KLQ4QXjS7iX0qR3r8U3q2iF9g1I'
);

async function testSupabase() {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000',
        title: 'test task',
        description: '',
      })
      .select()
      .maybeSingle();

    console.log("Error:", error);
    console.log("Data:", data);
}
testSupabase();
