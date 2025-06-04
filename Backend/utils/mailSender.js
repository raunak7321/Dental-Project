const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        })

        let info = await transporter.sendMail({
            from: { name: "Dental Care", address: process.env.EMAIL_USERNAME },
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        })
        return info;

    } catch (error) {
        console.error(error.message);
    }
}

module.exports = mailSender;
