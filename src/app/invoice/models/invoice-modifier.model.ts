import { ModifierType } from "../../shared/services/types/modifier.type";


export interface InvoiceModifier {
  name: string;
  percent: number;
  type: ModifierType;
}
