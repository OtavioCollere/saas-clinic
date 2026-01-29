import * as nodemailer from 'nodemailer'

export const createNodemailerTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'pearline.ruecker76@ethereal.email',
      pass: 'gEYP8bpVTU82vwgSxg',
    },
  })
}

