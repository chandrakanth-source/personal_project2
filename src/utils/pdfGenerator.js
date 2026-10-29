import jsPDF from 'jspdf';

export function generateInvoicePDF(sale, settings) {
  try {
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const currency = settings.currency || '$';

    // Header Background Accent Bar
    doc.setFillColor(16, 185, 129); // emerald 500
    doc.rect(0, 0, pageWidth, 8, 'F');

    // Shop Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // slate 900
    doc.text(settings.shopName || 'Computer Shop', 14, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105); // slate 600
    doc.text(settings.tagline || 'Sales & Service Hub', 14, 28);
    doc.text(`${settings.address || ''} | Tel: ${settings.phone || ''}`, 14, 33);
    if (settings.gstNumber) {
      doc.text(`Tax / GST: ${settings.gstNumber}`, 14, 38);
    }

    // Invoice Meta Right Box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(16, 185, 129);
    doc.text('TAX INVOICE', pageWidth - 14, 22, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Invoice #: ${sale.invoiceNumber}`, pageWidth - 14, 28, { align: 'right' });
    doc.text(`Date: ${new Date(sale.timestamp).toLocaleDateString()} ${new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, pageWidth - 14, 33, { align: 'right' });
    doc.text(`Payment: ${sale.paymentMethod || 'Cash'}`, pageWidth - 14, 38, { align: 'right' });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 44, pageWidth - 14, 44);

    // Bill To Customer Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('BILLED TO:', 14, 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(`Customer: ${sale.customerName || 'Walk-in Customer'}`, 14, 57);
    if (sale.customerPhone) {
      doc.text(`Contact: ${sale.customerPhone}`, 14, 62);
    }

    // Table Header
    const startY = 70;
    doc.setFillColor(241, 245, 249);
    doc.rect(14, startY, pageWidth - 28, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('Item Description', 18, startY + 5.5);
    doc.text('Category', 95, startY + 5.5);
    doc.text('Warranty', 125, startY + 5.5);
    doc.text('Qty', 148, startY + 5.5, { align: 'center' });
    doc.text('Price', 168, startY + 5.5, { align: 'right' });
    doc.text('Total', pageWidth - 18, startY + 5.5, { align: 'right' });

    // Table Rows
    let currentY = startY + 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    sale.items.forEach((item, index) => {
      // Alternate row bg
      if (index % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY - 5, pageWidth - 28, 8, 'F');
      }

      doc.setTextColor(15, 23, 42);
      const truncatedName = item.name.length > 42 ? item.name.substring(0, 40) + '...' : item.name;
      doc.text(truncatedName, 18, currentY);
      doc.text(item.category || '-', 95, currentY);
      doc.text(item.warranty ? `${item.warranty} mo` : 'N/A', 125, currentY);
      doc.text(String(item.quantity), 148, currentY, { align: 'center' });
      doc.text(`${currency}${item.price.toFixed(2)}`, 168, currentY, { align: 'right' });
      doc.text(`${currency}${(item.price * item.quantity).toFixed(2)}`, pageWidth - 18, currentY, { align: 'right' });

      currentY += 8;
    });

    // Subtotal & Calculations Box
    currentY += 6;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY, pageWidth - 14, currentY);
    currentY += 6;

    const calcX = pageWidth - 65;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    doc.text('Subtotal:', calcX, currentY);
    doc.text(`${currency}${sale.subtotal.toFixed(2)}`, pageWidth - 18, currentY, { align: 'right' });
    currentY += 6;

    if (sale.discountAmount > 0) {
      doc.text('Discount:', calcX, currentY);
      doc.setTextColor(220, 38, 38);
      doc.text(`-${currency}${sale.discountAmount.toFixed(2)}`, pageWidth - 18, currentY, { align: 'right' });
      doc.setTextColor(71, 85, 105);
      currentY += 6;
    }

    if (sale.taxAmount > 0) {
      doc.text(`Tax / GST (${sale.taxRate}%):`, calcX, currentY);
      doc.text(`${currency}${sale.taxAmount.toFixed(2)}`, pageWidth - 18, currentY, { align: 'right' });
      currentY += 6;
    }

    // Grand Total
    doc.setFillColor(236, 253, 245); // emerald 50
    doc.rect(calcX - 4, currentY - 4, pageWidth - calcX - 10, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(4, 120, 87); // emerald 700
    doc.text('Total Amount:', calcX, currentY + 3);
    doc.text(`${currency}${sale.total.toFixed(2)}`, pageWidth - 18, currentY + 3, { align: 'right' });

    // Footer & Warranty Policy
    currentY += 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Terms & Warranty Notice:', 14, currentY);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(settings.invoiceFooterNote || 'Goods once sold carry manufacturer warranty as mentioned above.', 14, currentY + 4, { maxWidth: pageWidth - 28 });

    // Save and trigger download
    doc.save(`Invoice-${sale.invoiceNumber}.pdf`);
    return true;
  } catch (err) {
    console.error('Failed to generate PDF invoice:', err);
    alert('Could not download PDF invoice: ' + err.message);
    return false;
  }
}

export function printInvoice(sale, settings = {}) {
  try {
    const currency = settings.currency || '₹';
    const printWindow = window.open('', '_blank', 'width=850,height=900');
    if (!printWindow) {
      alert('Please allow popups to print the bill.');
      return false;
    }

    const itemsHtml = (sale.items || []).map((item, idx) => `
      <tr>
        <td style="padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: center;">${idx + 1}</td>
        <td style="padding: 8px 6px; border-bottom: 1px solid #e2e8f0;">
          <strong>${item.name}</strong>
          ${item.brand ? `<div style="font-size: 11px; color: #64748b;">Brand: ${item.brand}</div>` : ''}
        </td>
        <td style="padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.warranty ? `${item.warranty} mo` : '-'}</td>
        <td style="padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: 600;">${item.quantity}</td>
        <td style="padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: right;">${currency}${Number(item.price).toFixed(2)}</td>
        <td style="padding: 8px 6px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">${currency}${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${sale.invoiceNumber} - ${settings.shopName || 'Sri Sai Computers'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #ffffff; }
          .invoice-card { max-width: 780px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 28px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; }
          .shop-title { font-size: 24px; font-weight: 800; color: #1e3a8a; margin: 0 0 4px; }
          .shop-sub { font-size: 12px; color: #64748b; line-height: 1.4; }
          .inv-badge { text-align: right; }
          .inv-badge h2 { margin: 0; font-size: 22px; color: #2563eb; font-weight: 800; }
          .meta-text { font-size: 12px; color: #475569; margin-top: 4px; }
          .info-grid { display: flex; justify-content: space-between; margin-bottom: 20px; background: #f8fafc; padding: 12px 16px; border-radius: 6px; font-size: 13px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th { background: #f1f5f9; padding: 10px 6px; font-weight: 700; color: #1e293b; border-bottom: 2px solid #cbd5e1; }
          .totals-section { display: flex; justify-content: flex-end; margin-bottom: 24px; }
          .totals-box { width: 280px; font-size: 13px; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .grand-total { font-size: 18px; font-weight: 800; color: #1e40af; border-top: 2px solid #94a3b8; padding-top: 8px; margin-top: 6px; }
          .footer { font-size: 11px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 14px; }
          @media print {
            body { padding: 0; }
            .invoice-card { border: none; padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; text-align: right;">
          <button onclick="window.print()" style="background: #2563eb; color: #fff; padding: 8px 18px; font-weight: 700; border-radius: 6px; border: none; cursor: pointer;">🖨️ Print Bill</button>
          <button onclick="window.close()" style="background: #e2e8f0; color: #1e293b; padding: 8px 14px; font-weight: 600; border-radius: 6px; border: none; cursor: pointer; margin-left: 8px;">Close</button>
        </div>
        <div class="invoice-card">
          <div class="header">
            <div>
              <h1 class="shop-title">${settings.shopName || 'Sri Sai Computers'}</h1>
              <div class="shop-sub">${settings.tagline || 'Shop Management System'}</div>
              <div class="shop-sub">${settings.address || 'Main Road'} | Ph: ${settings.phone || '9876543210'}</div>
              ${settings.gstNumber ? `<div class="shop-sub"><strong>GSTIN / Tax:</strong> ${settings.gstNumber}</div>` : ''}
            </div>
            <div class="inv-badge">
              <h2>TAX INVOICE</h2>
              <div class="meta-text"><strong>Invoice #:</strong> ${sale.invoiceNumber}</div>
              <div class="meta-text"><strong>Date:</strong> ${new Date(sale.timestamp).toLocaleDateString()} ${new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div class="meta-text"><strong>Payment:</strong> ${sale.paymentMethod || 'Cash'}</div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <strong>Billed To Customer:</strong>
              <div><strong>${sale.customerName || 'Walk-in Customer'}</strong></div>
              ${sale.customerPhone ? `<div>Phone: ${sale.customerPhone}</div>` : ''}
            </div>
            <div style="text-align: right;">
              <strong>Authorized Shop:</strong>
              <div>${settings.shopName || 'Sri Sai Computers'}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px;">#</th>
                <th style="text-align: left;">Product / Item Description</th>
                <th style="text-align: center;">Warranty</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals-section">
            <div class="totals-box">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>${currency}${Number(sale.subtotal).toFixed(2)}</span>
              </div>
              ${sale.discountAmount > 0 ? `
                <div class="totals-row" style="color: #dc2626;">
                  <span>Discount:</span>
                  <span>-${currency}${Number(sale.discountAmount).toFixed(2)}</span>
                </div>
              ` : ''}
              ${sale.taxAmount > 0 ? `
                <div class="totals-row">
                  <span>Tax (${sale.taxRate}%):</span>
                  <span>${currency}${Number(sale.taxAmount).toFixed(2)}</span>
                </div>
              ` : ''}
              <div class="totals-row grand-total">
                <span>Grand Total:</span>
                <span>${currency}${Number(sale.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <div>${settings.invoiceFooterNote || 'Thank you for your business! Warranty claims subject to manufacturer terms.'}</div>
          </div>
        </div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    return true;
  } catch (err) {
    console.error('Failed to print invoice:', err);
    alert('Could not open print window: ' + err.message);
    return false;
  }
}
