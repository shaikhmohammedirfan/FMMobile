export const environment = {
  // production: true,
  // firebaseConfig: {
  //   apiKey: 'AIzaSyCgTdf_lb0Jrg1lxxokuF9iDe-y3tekaUU',
  //   authDomain: 'estudentwebsite.firebaseapp.com',
  //   databaseURL: 'https://estudentwebsite.firebaseio.com',
  //   projectId: 'estudentwebsite',
  //   storageBucket: 'estudentwebsite.appspot.com',
  //   messagingSenderId: '555405333122',
  //   appId: '1:555405333122:web:dd8022241be45601185a9b',
  //   measurementId: 'G-KJBHPWWTHV',
  // },
  // recaptcha: {
  //   siteKey: '6LfyyyIkAAAAALPntbJGS1lei2148tdHpObv0A5V',
  // },

  // New settings
  // probably an env var, get the exact connection string from the database settings page
  // const connectionString = 'postgres://[db-user]:[db-password]@aws-0-[aws-region].pooler.supabase.com:6543/[db-name]?options=reference%3D[project-ref]'
  // const client = postgres(connectionString)
  // const db = drizzle(client);

  // const allUsers = await db.select().from(users);

  supabaseUrl: 'https://krkaevxowysjoxjeecdk.supabase.co',
  supabaseKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtya2Fldnhvd3lzam94amVlY2RrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUzMTM3ODIsImV4cCI6MTk4MDg4OTc4Mn0.2UcxrIdRtj0JctkTf8F7UD_4sMRwqk2dW3PnEeaNOFY',
};

const firebaseConfig = {};
