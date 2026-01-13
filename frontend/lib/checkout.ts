export type ShippingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
};

export type PlaceOrderPayload = {
  shippingAddress: ShippingAddress;
  paymentMethod?: "card";
  saveAddress?: boolean;
  productId?: string;
  quantity?: number;
};
