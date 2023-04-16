const client = require("./client");
const bcrypt = require("bcrypt");

async function createUser({ first_name, last_name, password, email }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(first_name, last_name, password, email)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (email) DO NOTHING
        RETURNING *;
        `,
      [first_name, last_name, hashedPassword, email]
    );

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function updateUser(userId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString === 0) {
    return;
  }
  try {
    const {
      rows: [user],
    } = await client.query(
      `
    UPDATE users
    SET ${setString}
    WHERE id=${userId}
    RETURNING *
    `,
      Object.values(fields)
    );
    
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  updateUser,
};
