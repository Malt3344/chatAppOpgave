
// bruges til at se om brugeren er logget ind
function requireLogin(request, response, next) {
    if (!request.session.isValidUser) {
        return response.status(401).json({ error: 'Ikke logget ind' })
    }
    next()
}

// bruges til at sikre brugeren har bestemt niveau
function requireLevel(level) {
    return (request, response, next) => {
        if (request.session.level < level) {
            return response.status(403).json({ error: 'Ingen adgang' })
        }
        next()
    }
}

export { requireLogin, requireLevel }