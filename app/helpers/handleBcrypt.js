import bcrypt from 'bcryptjs';

const encrypt = async (textPlain) => {
    const hash = await bcrypt.hash(textPlain, 10);
    return hash;
}

const compare = async (PasswordPlain, hashPassword) => {
    console.log(PasswordPlain, hashPassword);
    return await bcrypt.compare(PasswordPlain, hashPassword);
}

export { encrypt, compare };