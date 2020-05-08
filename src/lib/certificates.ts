import pem from 'pem'
import fs from 'fs'


export const readFileSync = <T>(fileUrl: string, password = ''): Promise<T> => {
  return new Promise((resolve, reject) => {
    const pfx = fs.readFileSync(fileUrl)
    pem.readPkcs12(pfx, { p12Password: password }, (err, cert) => {
      if (err) return reject(err)
      return resolve(cert)
    })
  })
}
