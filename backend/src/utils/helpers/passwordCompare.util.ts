import bcrypt from 'bcryptjs';

/**
 * Compares a plain password with a hashed password.
 * @param plainPassword - The password from DTO (user input)
 * @param hashedPassword - The hashed password stored in DB
 * @returns boolean - true if match, false if not
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
