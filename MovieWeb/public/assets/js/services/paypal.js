const axios = require('axios')

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: 'AfsYrlOB0kLE6AHmQncbi4WpLRBYycDkozi9rt6squEw6kxsw8aOzCV17bUaVuU0cYVVCSmHTcQEZS22',
            password:  'EGsZy--rf2N6J_9LEyWdLbwKj7Y0clZB0KuTdtdfIuYY_2YAsJVdc0RZkc4BbzFAA-4_nr-J6GPA24Ak'
        }
    })

    console.log(response.data)
    return response.data.access_token
}

exports.createOrder = async (amount) => {
    const accessToken = await generateAccessToken()

    const response = await axios({
        url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: 'Node.js Complete Course',
                            description: 'Node.js Complete Course with Express and MongoDB',
                            quantity: 1,
                            unit_amount: {
                                currency_code: 'USD',
                                value: amount + '.00'
                            }
                        }
                    ],

                    amount: {
                        currency_code: 'USD',
                        value: amount + '.00',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: amount + '.00'
                            }
                        }
                    }
                }
            ],

            application_context: {
                return_url: process.env.BASE_URL + '/complete-order',
                cancel_url: process.env.BASE_URL + '/cancel-order',
                shipping_preference: 'NO_SHIPPING',
                user_action: 'PAY_NOW',
                brand_name: 'DuyThong'
            }
        })
    })

    return response.data.links.find(link => link.rel === 'approve').href
}

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken()

    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        }
    })

    return response.data
}