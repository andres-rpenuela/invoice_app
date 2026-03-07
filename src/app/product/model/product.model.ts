

import { ProductCategory } from "../../shared/services/types/product.type";
import { ProductModifier } from "./product-modifier.model";

export class Product {
  id!: number;
  name!: string;
  price!: number;
  description?: string;
  stock!: number;
  category!: ProductCategory[];
  discounts?: ProductModifier[];
  taxes?: ProductModifier[];
}
