const axios = require('axios');
const { MongoClient } = require('mongodb');

async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    });

    //console.log(response.data);
    return response.data.access_token;
}

async function saveOrder(orderId, username) {
    const uri = process.env.mongoURI; // URL kết nối tới MongoDB của bạn
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('movieweb');
        const ordersCollection = database.collection('orders');

        await ordersCollection.insertOne({ orderId, username });
        console.log(`Order saved with ID: ${orderId}, Username: ${username}`);
    } catch (error) {
        console.error('Error occurred while saving order:', error);
    } finally {
        await client.close();
    }
}

exports.createOrder = async (amount, username1) => {
    const accessToken = await generateAccessToken();

    const numericAmount = parseFloat(amount);

    try {
        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            data: {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items: [
                            {
                                name: 'Node.js Complete Course',
                                description: 'Node.js Complete Course with Express and MongoDB',
                                quantity: '1',
                                unit_amount: {
                                    currency_code: 'USD',
                                    value: numericAmount.toFixed(2) // Đảm bảo giá trị là chuỗi số dạng 'X.00'
                                }
                            }
                        ],
                        amount: {
                            currency_code: 'USD',
                            value: numericAmount.toFixed(2),
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value: numericAmount.toFixed(2)
                                }
                            }
                        }
                    }
                ],
                application_context: {
                    return_url: process.env.BASE_URL + '/complete-order',
                    cancel_url: process.env.BASE_URL + '/cancel-order',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'CONTINUE',
                    brand_name: 'DuyThong'
                }
            }
        });

        // console.log(response.data);

        const orderId = response.data.id;

        var usernameMovive = username1;
        await saveOrder(orderId, usernameMovive);

        return response.data.links.find(link => link.rel === 'approve').href;
    } catch (error) {
        console.error('Error creating order:', error.response ? error.response.data : error.message);
        throw error;
    }
};

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken();

    try {
        const response = await axios({
            url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error capturing payment:', error.response ? error.response.data : error.message);
        throw error;
    }
};
