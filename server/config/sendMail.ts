import nodemail from 'nodemailer'

const sendEmail = async (to:string, subject: string, html: string) => {
    try {
        const transport = nodemail.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.SENDER_USER,
                pass: process.env.SENDER_PASSWORD
            },
            tls:{
                rejectUnauthorized: false
            }
        })

        // verify connection configuration
        await transport.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: to,
            subject: subject,
            html: html
        }

        const result = await transport.sendMail(mailOptions)

        return result
    } catch (error) {
        console.log(error)
        return error
    }
}

export default sendEmail