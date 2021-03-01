import debug from 'debug';
import * as nodemailer from 'nodemailer'
import ConfigProperty from "../../config/env.config";

const log: debug.IDebugger = debug('app:email-service');

class EmailService {
    private static instance: EmailService
    private _transporter: nodemailer.Transporter
    private readonly _emailUsername = ConfigProperty.EmailUsername
    private readonly _emailPassword = ConfigProperty.EmailPassword

    private constructor() {
        this._transporter = nodemailer.createTransport(
            `smtps://${this._emailUsername}:${this._emailPassword}@smtp.gmail.com`
        )
    }

    static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService()
        }

        return EmailService.instance
    }

    async sendMail(to: string, subject: string, content: string) {
        return new Promise((resolve, reject) => {
            const options = {
                from: this._emailUsername,
                to: to,
                subject: subject,
                text: content
            }
    
            this._transporter.sendMail(
                options, (e, info) => {
                    if (e) {
                        log('Error: ', e)
                        reject(false)
                    }

                    resolve(true)
                }
            )
        }) as Promise<boolean>
    }
}

export default EmailService.getInstance()