import nodemail from 'nodemailer'

const sendEmail = async (to:string, subject: string, url: string) => {
    try {
        const transport = nodemail.createTransport({
            host: "localhost",
            port: 25,
            secure: false, // upgrade later with STARTTLS
        })

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: to,
            subject: subject,
            html: '<h1>Welcome</h1><p>Merci de valider votre compte <a href="' + url + '">en cliquant ici</>'
        }

        const result = await transport.sendMail(mailOptions)

        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

export default sendEmail