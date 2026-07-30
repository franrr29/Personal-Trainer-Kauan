import { MercadoPagoConfig } from 'mercadopago';

const isProduction = process.env.NODE_ENV === 'production';

const client = new MercadoPagoConfig({
  accessToken: isProduction ? process.env.MP_ACCESS_TOKEN || '' : process.env.MP_ACCESS_TOKEN_TEST || '',
});

export default client;