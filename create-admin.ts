import * as bcrypt from 'bcryptjs';

async function generateInsertQuery() {
  const password = 'rahasia';
  const hash = await bcrypt.hash(password, 10);

  const query = `
INSERT INTO admins (
  id,
  first_name,
  last_name,
  email,
  date_of_birth,
  gender,
  password,
  createdAt,
  updatedAt
) VALUES (
  UUID(),
  'Super',
  'Admin',
  'admin@gmail.com',
  '1985-05-10',
  'male',
  '${hash}',
  NOW(),
  NOW()
);`;

  console.log('Execute this query in MySQL:');
  console.log(query);
}

//eslint-disable-next-line
generateInsertQuery();
