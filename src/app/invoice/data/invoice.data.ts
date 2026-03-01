import { Invoice } from "../models/invoice.model";

export const invoiceData:Invoice = {
  id: 1,
  name: 'Componntes de PC',
  client: {
    name: 'Andres',
    lastName: 'Doe',
    address: {
      country: 'USA',
      city: 'Los Angeles',
      street: 'One Street',
      number: 15
    }
  },
  company: {
    name: 'New Age',
    fiscalNumber: 3123123
  },
  items: [
    {
      id: 1,
      product: 'CPU Intel i9',
      price: 599,
      quantity: 1
    },
    {
      id: 2,
      product: 'Corsair Teclado Mecanico',
      price: 399,
      quantity: 2
    },
    {
      id: 3,
      product: 'Monitor Asus',
      price: 899,
      quantity: 3
    }
  ],
  discounts: [
    { name: 'Descuento especial', percent: 10, type: 'discount' }
  ],
  taxes: [
    { name: 'IVA', percent: 19, type: 'tax' }
  ]
}
