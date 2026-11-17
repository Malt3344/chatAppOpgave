import crypto from 'crypto'
import fs from 'fs'

// Lav nøglerne én gang og gem dem i filer.
// Ellers kan gamle beskeder ikke læses efter en genstart
if (!fs.existsSync('private_key.pem')) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
    fs.writeFileSync('public_key.pem', publicKey.export({ type: 'pkcs1', format: 'pem' }))
    fs.writeFileSync('private_key.pem', privateKey.export({ type: 'pkcs1', format: 'pem' }))
}

const publicKey = fs.readFileSync('public_key.pem', 'utf-8')
const privateKey = fs.readFileSync('private_key.pem', 'utf-8')

const options = { padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }

function encrypt(text){
    return crypto.publicEncrypt({key: publicKey, ...options}, Buffer.from(text)).toString('base64')
}

function decrypt(encrypted) {
    return crypto.privateDecrypt({ key: privateKey, ...options }, Buffer.from(encrypted, 'base64')).toString('utf-8')
}

export {encrypt, decrypt}
