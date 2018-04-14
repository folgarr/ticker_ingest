module.exports = {
    "coinigy": {
        "apiCredentials": {
            "apiKey"    : process.env.COINIGY_API_KEY,
            "apiSecret" : process.env.COINIGY_API_SECRET
        },
        "connectOptions": {
            "hostname"  : "sc-02.coinigy.com",
            "port"      : "443",
            "secure"    : "true"
        }
    },
    "influx": {
        "host": process.env.INFLUX_HOST,
    },
    'targetPairs': {
        'GDAX': [
            ['BTC', 'USD'],
            ['ETH', 'USD'],
            ['LTC', 'USD'],
        ]
    }
}