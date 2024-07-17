export type OrderDetail = {
  id: string;
  materialId: string;
  amount: number;
  actualAmount: number;
  paymentAmount: number;
  price: number;
  vat: number;
  supplierNote: string;
  internalNote: string;
};
