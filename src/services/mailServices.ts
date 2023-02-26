import AWS from 'aws-sdk'
import {AWS_SES} from "../constants";

AWS.config.update({
	accessKeyId: AWS_SES.AWS_SES_ACCESS_KEY_ID,
	secretAccessKey: AWS_SES.AWS_SES_SECRET_ACCESS_KEY,
	region: AWS_SES.AWS_SES_REGION
})

const SES = new AWS.SES()
class MailServices {
	static SES = new AWS.SES()
	sendMail(to: string, subject: string, message: string, from: string) {
		const params = {
			Destination: {
				ToAddresses: [to]
			},
			Message: {
				Body: {
					// Html: {
					// 	Charset: 'UTF-8',
					// 	Data: message
					// },
					Text: {
						Charset: "UTF-8",
						Data: message
					}
				},
				Subject: {
					Charset: 'UTF-8',
					Data: subject
				}
			},
			ReturnPath: from ? from : AWS_SES.AWS_SES_FROM,
			Source: from ? from : AWS_SES.AWS_SES_FROM,
		};
		return new Promise((resolve, reject) => {
			SES.sendEmail(params,
				(error, data) => {
					if (error) reject(error)
					resolve(data)
				}
			)
		})
	}
}

export default MailServices
