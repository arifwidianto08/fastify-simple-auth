import sendGrid from '@sendgrid/mail'
import type { MailDataRequired } from '@sendgrid/mail'

sendGrid.setApiKey(process.env.SENDGRID_API_KEY)

export async function sendEmail(data: Partial<MailDataRequired>) {
  const sender = data.from || process.env.EMAIL_SENDER

  console.log('Sending an email...')
  console.log('Email Data : ', data)
  return sendGrid
    .send({
      ...(data as MailDataRequired),
      from: sender,
    })
    .then(() => {
      console.log('Email sent.')
    })
    .catch((error) => {
      console.error(error)
    })
}
