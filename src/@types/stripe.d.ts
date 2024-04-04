export type Card = {
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: number;
  };
};

type MoneyType = 'usd' | 'brl' | 'eur' | 'gbp' | 'jpy' | 'cad' | 'aud' | 'chf' | 'cny' | 'inr' | 'krw' | 'mxn';
