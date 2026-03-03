import { Invoice } from "../models/invoice.model";

export const invoiceData: Invoice = {
  id: 1,
  name: 'Componentes de PC',
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
      quantity: 1,
      discounts: [
        { name: 'Oferta CPU', percent: 5, type: 'discount' }
      ],
      taxes: [
        { name: 'Impuesto especial CPU', percent: 2, type: 'tax' },
        { name: 'IVA', percent: 19, type: 'tax' }
      ]
    },
    {
      id: 2,
      product: 'Corsair Teclado Mecánico',
      price: 399,
      quantity: 2,
      discounts: [
        { name: 'Descuento teclado', percent: 10, type: 'discount' }
      ],
      taxes: [
        { name: 'IVA', percent: 19, type: 'tax' }
      ]
    },
    {
      id: 3,
      product: 'Monitor Asus',
      price: 899,
      quantity: 3,
      discounts: [],
      taxes: [
        { name: 'Impuesto especial monitor', percent: 5, type: 'tax' },
        { name: 'IVA', percent: 19, type: 'tax' }
      ]
    },
    {
      id: 4,
      product: 'Mouse Logitech',
      price: 99,
      quantity: 4,
      discounts: [
        { name: 'Oferta mouse', percent: 15, type: 'discount' }
      ],
      taxes: [
        { name: 'IVA', percent: 19, type: 'tax' }
      ]
    }
  ],
  discounts: [
    { name: 'Descuento especial factura', percent: 10, type: 'discount' }
  ],
  taxes: [] // Todos los productos tienen IVA individual
};
