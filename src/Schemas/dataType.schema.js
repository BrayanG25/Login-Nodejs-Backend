import { z } from 'zod';

/*
    passwordRegex: Ensures the password contains at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&). The minimum length of the password must be 8 characters.
    emailRegex: Ensures the email format is valid. It must contain alphanumeric characters, dots, underscores, plus and minus signs before the @ symbol, followed by a valid domain.
    userNameSchema: Ensures the username is at least 5 characters long.
*/

const passwordMinLength = 8;
const passwordLowerCaseRegex = /[a-z]/;
const passwordUpperCaseRegex = /[A-Z]/;
const passwordNumberRegex = /\d/;
const passwordSymbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const lengthMessage = 'The password must be at least 8 characters long.';
const lowercaseMessage = 'The password must contain at least one lowercase letter.';
const uppercaseMessage = 'The password must contain at least one uppercase letter.';
const numberMessage = 'The password must contain at least one number.';
const specialCharMessage = 'The password must contain at least one special character.';
const emailMessage = 'Invalid email format.';
const usernameMessage = 'Username must be at least 5 characters long.';
// const passwordMessage = 'Password must contain at least one lowercase letter, one uppercase letter, one number, one special character, and be at least 8 characters long.';

export const passwordSchema = z.string()
    .min(passwordMinLength, { message: lengthMessage })
    .refine((val) => passwordLowerCaseRegex.test(val), { message: lowercaseMessage })
    .refine((val) => passwordUpperCaseRegex.test(val), { message: uppercaseMessage })
    .refine((val) => passwordNumberRegex.test(val), { message: numberMessage })
    .refine((val) => passwordSymbolRegex.test(val), { message: specialCharMessage });
export const emailSchema = z.string().regex(emailRegex, { message: emailMessage });
export const usernameSchema = z.string().min(5, { message: usernameMessage });
export const string = z.string();
// export const passwordSchema = z.string().regex(passwordRegex, { message: passwordMessage });