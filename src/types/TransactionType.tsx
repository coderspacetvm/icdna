export type TransactionType = {
  id: number;
  name: string;
  type: string;
  icon: string;
  amount: number;
  currency: string;
  direction: 'in' | 'out';
  transactionType: 'credit' | 'debit';
};
