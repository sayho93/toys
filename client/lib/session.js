const SESSION_PASSWORD = process.env.SESSION_PASSWORD
if (SESSION_PASSWORD === undefined) {
    throw new Error('SESSION_PASSWORD is not defined')
}

export const sessionOptions = {
    password: SESSION_PASSWORD,
    cookieName: 'toys',
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        // secure: process.env.NODE_ENV === 'production',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
}
