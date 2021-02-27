export default {
    SaltRound: process.env.SALT_ROUND ?? '12',
    JwtSecret: process.env.JWT_SECRET ?? 'loremipsum',
    JwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '10h'
}