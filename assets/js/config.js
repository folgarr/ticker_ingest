Object.defineProperty(exports, "__esModule", {
  value: true
});
exports['default'] = {
  coinigy: {
    apiCredentials: {
      apiKey: process.env.COINIGY_API_KEY,
      apiSecret: process.env.COINIGY_API_SECRET
    },
    connectOptions: {
      hostname: 'sc-02.coinigy.com',
      port: '443',
      secure: 'true'
    },
    channels: [
    // BTC
    'TRADE-BTHM--BTC--KRW', 'TRADE-FLYR--BTC--JPY', 'TRADE-GDAX--BTC--USD', 'TRADE-GDAX--BTC--EUR', 'TRADE-BITF--BTC--USD',

    // ETH
    'TRADE-BITF--ETH--USD', 'TRADE-BINA--ETH--BTC', 'TRADE-OKEX--ETH--BTC', 'TRADE-BTHM--ETH--KRW', 'TRADE-GDAX--ETH--USD', 'TRADE-KRKN--ETH--USD', 'TRADE-KRKN--ETH--EUR',

    // XRP
    'TRADE-BTHM--XRP--KRW', 'TRADE-BITF--XRP--USD', 'TRADE-BITF--XRP--BTC', 'TRADE-BINA--XRP--BTC',

    // BCH
    'TRADE-BITF--BCH--USD', 'TRADE-HITB--BCH--BTC', 'TRADE-GDAX--BCH--USD',

    // EOS
    'TRADE-BITF--EOS--USD', 'TRADE-BTHM--EOS--KRW', 'TRADE-BINA--EOS--BTC',

    // LTC
    'TRADE-GDAX--LTC--USD', 'TRADE-OKEX--LTC--BTC', 'TRADE-BITF--LTC--USD', 'TRADE-BINA--LTC--BTC', 'TRADE-BTHM--LTC--KRW',

    // ADA
    'TRADE-BINA--ADA--BTC', 'TRADE-BTRX--ADA--BTC',

    // XLM
    'TRADE-BINA--XLM--BTC', 'TRADE-BTRX--XLM--BTC', 'TRADE-KRKN--XLM--USD', 'TRADE-KRKN--XLM--EUR',

    // IOTA
    'TRADE-BITF--IOT--USD', 'TRADE-BITF--IOT--EUR', 'TRADE-BITF--IOT--BTC', 'TRADE-BINA--IOTA--BTC',

    // NEO
    'TRADE-BITF--NEO--USD', 'TRADE-BINA--NEO--BTC',

    // XMR
    'TRADE-BTHM--XMR--KRW', 'TRADE-BINA--XMR--BTC', 'TRADE-BITF--XMR--USD', 'TRADE-BITF--XMR--BTC', 'TRADE-BTRX--XMR--BTC',

    // DASH
    'TRADE-HITB--DASH--BTC', 'TRADE-BITF--DSH--USD', 'TRADE-BINA--DASH--BTC',

    // TRON
    'TRADE-BINA--TRX--BTC', 'TRADE-BTHM--TRX--KRW',

    // XEM (NEM)
    'TRADE-BINA--XEM--BTC', 'TRADE-BTRX--XEM--BTC',

    // ETC
    'TRADE-BINA--ETC--BTC', 'TRADE-BTHM--ETC--KRW', 'TRADE-BITF--ETC--USD',

    // QTUM
    'TRADE-BTHM--QTUM--KRW', 'TRADE-BINA--QTUM--BTC',

    // OMG
    'TRADE-BINA--OMG--BTC', 'TRADE-KRKN--ZEC--EUR', 'TRADE-BTRX--OMG--BTC',

    // BNB
    'TRADE-BINA--BNB--BTC',

    // ICX (ICON)
    'TRADE-BINA--ICX--BTC', 'TRADE-BTHM--ICX--KRW',

    // LSK
    'TRADE-YOBT--LSK--BTC', 'TRADE-BINA--LSK--BTC',

    // BTG
    'TRADE-BINA--BTG--BTC', 'TRADE-BTHM--BTG--KRW', 'TRADE-BITF--BTG--USD',

    // XVG
    'TRADE-BINA--XVG--BTC', 'TRADE-BTRX--XVG--BTC',

    // ZEC
    'TRADE-YOBT--ZEC--BTC', 'TRADE-HITB--ZEC--BTC', 'TRADE-BINA--ZEC--BTC', 'TRADE-BITF--ZEC--BTC', 'TRADE-BITF--ZEC--USD', 'TRADE-BTHM--ZEC--KRW',

    // NANO
    'TRADE-BINA--NANO--BTC', 'TRADE-KUCN--XRB--BTC',

    // STEEM
    'TRADE-BINA--STEEM--BTC', 'TRADE-BTRX--STEEM--BTC',

    // SC (Siacoin)
    'TRADE-BTRX--SC--BTC', 'TRADE-BTRX--SC--ETH',

    // DOGE
    'TRADE-BTRX--DOGE--BTC', 'TRADE-HITB--DOGE--USD',

    // ZRX (0x)
    'TRADE-BINA--ZRX--BTC', 'TRADE-BTRX--ZRX--BTC',

    // SNT (STATUS)
    'TRADE-BINA--SNT--BTC', 'TRADE-BITF--SNT--USD',

    // GOLEM (GNT)
    'TRADE-BTRX--GNT--BTC', 'TRADE-BITF--GNT--USD', 'TRADE-BITF--GNT--BTC',

    // Decred (DCR)
    'TRADE-BTRX--DCR--BTC',

    // Augur (REP)
    'TRADE-KRKN--REP--EUR', 'TRADE-KRKN--REP--USD', 'TRADE-KRKN--REP--BTC', 'TRADE-BTRX--REP--BTC',

    // BAT
    'TRADE-BINA--BAT--BTC', 'TRADE-BTRX--BAT--BTC', 'TRADE-BITF--BAT--USD',

    // SALT
    'TRADE-BINA--SALT--BTC', 'TRADE-BTRX--SALT--BTC']
  },
  influx: {
    host: process.env.INFLUX_HOST,
    username: process.env.INFLUX_USERNAME,
    password: process.env.INFLUX_PASSWORD
  }
};