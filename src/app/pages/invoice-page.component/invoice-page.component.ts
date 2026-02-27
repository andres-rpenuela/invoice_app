/*import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
  generatePDF() {
    const element = document.querySelector('div');
    if (!element) return;
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('factura.pdf');
      window.print();
    });
  }*/
import { ChangeDetectionStrategy, Component, inject, Inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../invoice/servicies/invoice.service';
import { Invoice } from '../../invoice/models/invoice.model';
import { InvoiceHeadComponent } from '../../invoice/components/invoice-head/invoice-head.component';
import { InvoiceDetailComponent } from '../../invoice/components/invoice-detail/invoice-detail.component';
import { InvoiceItemComponent } from '../../invoice/components/invoice-item/invoice-item.component';

@Component({
  selector: 'app-invoice-page.component',
  imports: [InvoiceHeadComponent, InvoiceDetailComponent, InvoiceItemComponent],
  templateUrl: './invoice-page.component.html',
  styleUrl: './invoice-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoicePageComponent implements OnInit{

  private _invoiceService = inject(InvoiceService)

  ngOnInit(): void {

  }


  get invoice():Invoice{
    return this._invoiceService.getInvoice();
  }


}
