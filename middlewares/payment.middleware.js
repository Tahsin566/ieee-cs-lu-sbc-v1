import globals from 'node-global-storage'
import axios from 'axios'

export const BkashMiddleware = async (req, res,next) => {

    console.log("Hi")
    
    globals.unsetValue('id_token')

    try {
        const { data } = await axios.post(process.env.bkash_grant_token_url, {
            app_key: process.env.bkash_api_key,
            app_secret: process.env.bkash_secret_key,
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "username": process.env.bkash_username,
                "password": process.env.bkash_password,
            }
        })

        console.log(data)

        globals.setValue('id_token', data.id_token, { protected: true })

        next()
    } catch (error) {
        console.log("an error occurred -->",error)
        next(error)
    }
}