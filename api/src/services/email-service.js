const nodemailer = require('nodemailer');
const rimraf = require("rimraf");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv').config();
const process = require('process');
const db = require("../models");
const SentEmail = db.SentEmail;

module.exports = class EmailService {

    constructor() {

        if(process.env.EMAIL) {

            this.email = process.env.EMAIL; 

            this.transport = nodemailer.createTransport({
                pool: true,
                host: "smtp.ionos.es",
                port: 587,
                secureConnection: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                    ciphers:'SSLv3'
                }
            });

        } else {

            this.email = process.env.GOOGLE_EMAIL; 

            this.transport = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.GOOGLE_EMAIL,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                    accessToken: this.getAccessToken()
                }
            });
        }
    }

    getAccessToken() {

        const myOAuth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        )

        myOAuth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        const myAccessToken = myOAuth2Client.getAccessToken();

        return myAccessToken;
    }

    sendEmail(email, customer) {

        const mailOptions = {
            from: this.email, 
            to: customer.email,
            subject: email.subject,
            html: email.content
        }

        this.transport.sendMail(mailOptions, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                SentEmail.create(
                    {
                        customerId: customer.id,
                        emailId: email.id
                    }
                )
            }
        });
    }

    deleteImages = async () => {
           
        await ImageOriginal.destroy({
            where: {
                entity: this.entity,
                entityId: this.entityId
            }
        });

        await ImageResize.destroy({
            where: {
                entity: this.entity,
                entityId: this.entityId
            }
        });

        const directory = path.join(__dirname, `../storage/images/${this.entity}/${this.entityId}`);

        if (fs.existsSync(directory)) {
            rimraf.sync(directory);
        }
    }
}