export default {
    SaltRound: process.env["SALT_ROUND"] ?? '12',
    JwtSecret: process.env["JWT_SECRET"] ?? 'loremipsum',
    JwtExpiresIn: process.env["JWT_EXPIRES_IN"] ?? '10h',
    EmailUsername: process.env["EMAIL_USERNAME"] ?? 'victortemitope95@gmail.com',
    EmailPassword: process.env["EMAIL_PASSWORD"] ?? '',
    Db_Name: process.env["DB_NAME"] ?? 'stackoverflow_clone',
    Db_Username: process.env["DB_USERNAME"] ?? 'root',
    Db_Password: process.env["DB_PASSWORD"] ?? 'Password12'
}