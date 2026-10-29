import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Printer, 
  Download, 
  Save, 
  Trash2, 
  Plus, 
  Check, 
  FileText, 
  Sliders, 
  PenTool, 
  ShieldCheck, 
  Eraser, 
  Eye, 
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';

// Helper to convert numbers to Indian Rupee Words
function numberToWords(num) {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (Number(n[1]) !== 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (Number(n[2]) !== 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (Number(n[3]) !== 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (Number(n[4]) !== 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str.trim() ? 'Rupees ' + str.trim() + ' Only' : 'Rupees Zero Only';
}

export default function CustomBillPaperBilling({
  products = [],
  settings = {},
  onCompleteSale,
  showToast
}) {
  // 1. BILL PAPER / LETTERHEAD TEMPLATE
  const [billPaperImage, setBillPaperImage] = useState('/images/sample_letterhead.jpg');
  const [printPaperBackground, setPrintPaperBackground] = useState(true);
  const [topMarginOffset, setTopMarginOffset] = useState(90); // mm offset from top for physical letterhead

  // 2. BILL / INVOICE METADATA
  const [invoiceNumber, setInvoiceNumber] = useState(`STC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [paymentMode, setPaymentMode] = useState('Cash');

  // 3. CUSTOMER DETAILS
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGST, setCustomerGST] = useState('');

  // 4. ITEMS LIST
  const [items, setItems] = useState([
    {
      id: 1,
      name: 'Laptop (Dell Inspiron i5 / 8GB / 512GB)',
      serialNo: 'DELL-SN-892401',
      quantity: 1,
      price: 54990,
      taxPercent: 18
    }
  ]);

  // 5. SIGN & STAMP SETTINGS
  const [applyStamp, setApplyStamp] = useState(true);
  const [stampImage, setStampImage] = useState('/images/shop_stamp.png');
  const [applySignature, setApplySignature] = useState(true);
  const [signatureImage, setSignatureImage] = useState(null);
  const [signatureMode, setSignatureMode] = useState('draw'); // 'draw' | 'upload' | 'text'
  const [typedSignatory, setTypedSignatory] = useState('Authorized Signatory');
  const [isDrawing, setIsDrawing] = useState(false);

  // References
  const sigCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const stampInputRef = useRef(null);
  const sigUploadRef = useRef(null);
  const printableAreaRef = useRef(null);

  // Calculations
  const subtotal = items.reduce((acc, it) => acc + (Number(it.price) * Number(it.quantity) || 0), 0);
  const totalTax = items.reduce((acc, it) => {
    const itemTotal = (Number(it.price) * Number(it.quantity)) || 0;
    const taxRate = Number(it.taxPercent) || 0;
    return acc + (itemTotal * (taxRate / 100));
  }, 0);
  const grandTotal = Math.round(subtotal + totalTax);

  // Signature Canvas Setup
  useEffect(() => {
    if (signatureMode === 'draw' && sigCanvasRef.current) {
      const canvas = sigCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#1e3a8a'; // Blue ink style
    }
  }, [signatureMode]);

  // Drawing Handlers
  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (sigCanvasRef.current) {
      setSignatureImage(sigCanvasRef.current.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    if (sigCanvasRef.current) {
      const canvas = sigCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureImage(null);
    }
  };

  // Upload Custom Bill Paper
  const handleBillPaperUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBillPaperImage(event.target.result);
      showToast?.('Custom bill paper template loaded!');
    };
    reader.readAsDataURL(file);
  };

  // Upload Custom Stamp
  const handleStampUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setStampImage(event.target.result);
      showToast?.('Custom shop stamp updated!');
    };
    reader.readAsDataURL(file);
  };

  // Upload Signature Image
  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setSignatureImage(event.target.result);
      showToast?.('Signature image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  // Add Item
  const handleAddItem = (presetProduct = null) => {
    if (presetProduct) {
      setItems(prev => [
        ...prev,
        {
          id: Date.now(),
          name: `${presetProduct.name} (${presetProduct.brand} ${presetProduct.configuration || ''})`,
          serialNo: `SN-${Math.floor(100000 + Math.random() * 900000)}`,
          quantity: 1,
          price: presetProduct.price || 0,
          taxPercent: 18
        }
      ]);
    } else {
      setItems(prev => [
        ...prev,
        {
          id: Date.now(),
          name: '',
          serialNo: '',
          quantity: 1,
          price: 0,
          taxPercent: 18
        }
      ]);
    }
  };

  // Update Item
  const handleUpdateItem = (id, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Remove Item
  const handleRemoveItem = (id) => {
    if (items.length === 1) {
      alert('The bill must contain at least one item.');
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Download PDF Handler with jsPDF
  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = 210;
      const pageHeight = 297;

      // 1. If background paper is enabled, embed the uploaded bill paper template
      if (printPaperBackground && billPaperImage) {
        try {
          doc.addImage(billPaperImage, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
        } catch (e) {
          console.warn('Could not render background image in PDF:', e);
        }
      }

      // Starting Y position based on top margin offset
      let currentY = printPaperBackground ? (topMarginOffset - 25) : 30;

      // If no background paper, draw a clean fallback header
      if (!printPaperBackground) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(30, 58, 138); // Navy blue
        doc.text(settings.shopName || 'Sri Thanu Communications', 16, currentY);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(settings.tagline || 'Your one-stop shop for computers, accessories and IT solutions', 16, currentY + 6);
        doc.text(`${settings.address || 'Tech Commercial Plaza, Main Road'} | Ph: ${settings.phone || '+91 98765 43210'}`, 16, currentY + 11);
        if (settings.gstNumber) {
          doc.text(`GSTIN / UIN: ${settings.gstNumber}`, 16, currentY + 16);
        }

        currentY += 26;
      }

      // Invoice Details & Customer Info Grid
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(14, currentY, pageWidth - 28, 24, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text('BILLED TO (CUSTOMER):', 18, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.text(`Name: ${customerName || 'Walk-in Customer'}`, 18, currentY + 12);
      doc.text(`Phone: ${customerPhone || '—'}   ${customerGST ? `| GSTIN: ${customerGST}` : ''}`, 18, currentY + 17);
      if (customerAddress) {
        doc.text(`Address: ${customerAddress.slice(0, 45)}`, 18, currentY + 22);
      }

      // Invoice metadata right side
      const rightX = pageWidth - 70;
      doc.setFont('helvetica', 'bold');
      doc.text(`INVOICE NO: ${invoiceNumber}`, rightX, currentY + 6);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${invoiceDate}`, rightX, currentY + 12);
      doc.text(`Payment: ${paymentMode}`, rightX, currentY + 17);

      currentY += 30;

      // Table Header
      doc.setFillColor(30, 58, 138);
      doc.rect(14, currentY, pageWidth - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);
      doc.text('#', 18, currentY + 5.5);
      doc.text('Item Description & Serial No.', 26, currentY + 5.5);
      doc.text('Qty', 125, currentY + 5.5, { align: 'center' });
      doc.text('Rate (₹)', 148, currentY + 5.5, { align: 'right' });
      doc.text('GST %', 168, currentY + 5.5, { align: 'center' });
      doc.text('Total (₹)', pageWidth - 18, currentY + 5.5, { align: 'right' });

      currentY += 8;

      // Table Rows
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);

      items.forEach((item, index) => {
        if (index % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, currentY, pageWidth - 28, 8, 'F');
        }

        doc.text(String(index + 1), 18, currentY + 5.5);
        const nameText = item.name || 'Custom Hardware Item';
        doc.text(nameText.slice(0, 48), 26, currentY + 5.5);
        if (item.serialNo) {
          doc.setFontSize(7);
          doc.setTextColor(100, 116, 139);
          doc.text(`S/N: ${item.serialNo}`, 26, currentY + 8);
          doc.setFontSize(8);
          doc.setTextColor(15, 23, 42);
        }

        doc.text(String(item.quantity), 125, currentY + 5.5, { align: 'center' });
        doc.text(Number(item.price).toLocaleString('en-IN'), 148, currentY + 5.5, { align: 'right' });
        doc.text(`${item.taxPercent}%`, 168, currentY + 5.5, { align: 'center' });
        const lineTotal = (Number(item.price) * Number(item.quantity)) * (1 + (Number(item.taxPercent) / 100));
        doc.text(Math.round(lineTotal).toLocaleString('en-IN'), pageWidth - 18, currentY + 5.5, { align: 'right' });

        currentY += item.serialNo ? 10 : 8;
      });

      // Total Breakdown Box
      currentY += 6;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, currentY, pageWidth - 14, currentY);
      currentY += 6;

      const calcRightX = pageWidth - 70;
      doc.setFontSize(8.5);
      doc.text('Subtotal (Taxable):', calcRightX, currentY);
      doc.text(`₹ ${subtotal.toLocaleString('en-IN')}`, pageWidth - 18, currentY, { align: 'right' });
      currentY += 5;

      doc.text('GST Total (CGST + SGST):', calcRightX, currentY);
      doc.text(`₹ ${Math.round(totalTax).toLocaleString('en-IN')}`, pageWidth - 18, currentY, { align: 'right' });
      currentY += 6;

      // Grand Total Highlight
      doc.setFillColor(239, 246, 255);
      doc.roundedRect(calcRightX - 4, currentY - 4, pageWidth - calcRightX - 10, 9, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 58, 138);
      doc.text('Grand Total:', calcRightX, currentY + 2.5);
      doc.text(`₹ ${grandTotal.toLocaleString('en-IN')}`, pageWidth - 18, currentY + 2.5, { align: 'right' });

      // Amount in Words
      currentY += 12;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Amount in Words: ${numberToWords(grandTotal)}`, 14, currentY);

      // Sign and Stamp Section
      currentY += 16;
      const stampSectionY = currentY;

      // Terms on left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Terms & Warranty Conditions:', 14, stampSectionY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text('1. All hardware products carry genuine manufacturer warranty.', 14, stampSectionY + 4);
      doc.text('2. Please retain this invoice and box serial for warranty claims.', 14, stampSectionY + 8);
      doc.text('3. Physical damage or burn voids warranty.', 14, stampSectionY + 12);

      // Sign & Stamp Box on right
      const stampX = pageWidth - 75;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(30, 58, 138);
      doc.text('For SRI THANU COMMUNICATIONS', stampX, stampSectionY);

      // Render Shop Stamp
      if (applyStamp && stampImage) {
        try {
          doc.addImage(stampImage, 'PNG', stampX, stampSectionY + 4, 24, 24);
        } catch (e) {
          console.warn('Could not add stamp image to PDF:', e);
        }
      }

      // Render Signature
      if (applySignature && signatureImage) {
        try {
          doc.addImage(signatureImage, 'PNG', stampX + 26, stampSectionY + 6, 32, 16);
        } catch (e) {
          console.warn('Could not add signature image to PDF:', e);
        }
      } else if (applySignature && typedSignatory) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(30, 58, 138);
        doc.text(typedSignatory, stampX + 28, stampSectionY + 16);
      }

      // Authorized Signatory Label
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Authorized Signatory / Shop Seal', stampX + 4, stampSectionY + 28);

      // Download Trigger
      doc.save(`Invoice_${invoiceNumber}.pdf`);
      showToast?.(`Downloaded Invoice #${invoiceNumber} PDF!`);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Error generating PDF: ' + err.message);
    }
  };

  // Save to Sales History
  const handleSaveSale = () => {
    if (!customerName.trim()) {
      alert('Please enter a customer name.');
      return;
    }
    const saleRecord = {
      id: `sale-${Date.now()}`,
      invoiceNumber,
      customerName,
      customerPhone,
      customerAddress,
      customerGST,
      timestamp: Date.now(),
      paymentMethod: paymentMode,
      items: items.map(it => ({
        id: it.id,
        name: it.name,
        serialNo: it.serialNo,
        quantity: it.quantity,
        price: it.price
      })),
      subtotal,
      taxAmount: totalTax,
      total: grandTotal,
      hasStamp: applyStamp,
      hasSignature: applySignature
    };

    onCompleteSale?.(saleRecord);
    showToast?.(`Saved Invoice #${invoiceNumber} to Sales Records!`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      maxWidth: 1320,
      margin: '0 auto',
      width: '100%',
      paddingBottom: 40
    }}>
      {/* 1. Header Banner */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: 16,
        border: '1px solid var(--border-color)',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            backgroundColor: '#1d68ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 18px rgba(29, 104, 237, 0.35)'
          }}>
            <FileText size={28} />
          </div>
          <div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: '#1e3a8a',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}>
              Create PDF Bill (Custom Bill Paper & Sign/Stamp)
            </h1>
            <p style={{
              fontSize: '0.92rem',
              color: '#64748b',
              marginTop: 4
            }}>
              Upload your shop's own bill paper template, fill item & customer details, apply authorized stamp & sign, and print or export PDF.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={handleSaveSale}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '11px 20px',
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-subtle)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              transition: 'all 0.15s ease'
            }}
          >
            <Save size={16} />
            <span>Save to History</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '11px 22px',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <Download size={17} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#1d68ed',
              color: '#ffffff',
              padding: '11px 24px',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(29, 104, 237, 0.35)'
            }}
          >
            <Printer size={17} />
            <span>Print Bill</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Fill Details on Left, Live A4 Bill Paper on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '480px 1fr',
        gap: 24,
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Controls & Form Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Card 1: Bill Paper / Template Upload */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Upload size={18} color="#1d68ed" />
              <span>1. Upload Your Bill Paper / Letterhead</span>
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 72,
                height: 96,
                borderRadius: 8,
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                backgroundColor: '#f8fafc',
                flexShrink: 0,
                position: 'relative'
              }}>
                <img
                  src={billPaperImage}
                  alt="Bill Paper"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Custom Bill Paper Template
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
                  Upload your shop's scanned letterhead or bill stationery.
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      padding: '7px 14px',
                      borderRadius: 8,
                      backgroundColor: '#1d68ed',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    Upload Own Paper
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBillPaperUpload}
                    style={{ display: 'none' }}
                  />

                  <button
                    onClick={() => setBillPaperImage('/images/sample_letterhead.jpg')}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      color: '#475569'
                    }}
                  >
                    Reset Template
                  </button>
                </div>
              </div>
            </div>

            {/* Print Mode Toggles */}
            <div style={{
              backgroundColor: 'var(--bg-subtle)',
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              fontSize: '0.82rem'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontWeight: 600, color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={printPaperBackground}
                  onChange={(e) => setPrintPaperBackground(e.target.checked)}
                />
                <span>Include Letterhead Graphic on Print & PDF</span>
              </label>

              {!printPaperBackground && (
                <div style={{ fontSize: '0.75rem', color: '#0284c7', paddingLeft: 22 }}>
                  ℹ️ <strong>Physical Stationery Mode:</strong> Will only print text & tables aligned to your pre-printed physical paper inside the printer.
                </div>
              )}

              {/* Offset slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.78rem', marginBottom: 4 }}>
                  <span>Header Margin Offset</span>
                  <span>{topMarginOffset} mm</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={topMarginOffset}
                  onChange={(e) => setTopMarginOffset(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Fill Details (Customer & Bill Info) */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 14
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FileText size={18} color="#1d68ed" />
              <span>2. Fill Customer & Bill Details</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Invoice No.
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#1e3a8a'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Customer Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Address / City
                </label>
                <input
                  type="text"
                  placeholder="Customer address"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: 4 }}>
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-subtle)',
                    fontSize: '0.85rem',
                    color: 'var(--text-main)'
                  }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI / PhonePe / GPay">UPI / QR Code</option>
                  <option value="Debit / Credit Card">Debit / Credit Card</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card 3: Fill Items Table */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a' }}>
                3. Add Items & Serial Numbers
              </h2>

              {/* Quick Add from Inventory dropdown */}
              <select
                onChange={(e) => {
                  const prod = products.find(p => p.id === e.target.value);
                  if (prod) handleAddItem(prod);
                  e.target.value = '';
                }}
                defaultValue=""
                style={{
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#eff6ff',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#1d68ed',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>+ Add From In-Stock</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} - ₹{p.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Items Editor */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {items.map((item, idx) => (
                <div 
                  key={item.id}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 10,
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8
                  }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      placeholder="Item name / model description"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}
                    />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      style={{ color: '#ef4444', padding: '4px' }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.6fr 0.9fr 0.7fr', gap: 8 }}>
                    <input
                      type="text"
                      placeholder="Serial No. / IMEI"
                      value={item.serialNo}
                      onChange={(e) => handleUpdateItem(item.id, 'serialNo', e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.8rem'
                      }}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', Number(e.target.value) || 1)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.82rem',
                        textAlign: 'center'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Price ₹"
                      value={item.price}
                      onChange={(e) => handleUpdateItem(item.id, 'price', Number(e.target.value) || 0)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.82rem',
                        textAlign: 'right',
                        fontWeight: 600
                      }}
                    />
                    <select
                      value={item.taxPercent}
                      onChange={(e) => handleUpdateItem(item.id, 'taxPercent', Number(e.target.value))}
                      style={{
                        padding: '6px 4px',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        backgroundColor: '#ffffff',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                </div>
              ))}

              <button
                onClick={() => handleAddItem()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '9px',
                  borderRadius: 8,
                  border: '1px dashed #93c5fd',
                  backgroundColor: '#f0f7ff',
                  color: '#1d68ed',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <Plus size={16} />
                <span>+ Add Another Item Line</span>
              </button>
            </div>
          </div>

          {/* Card 4: Sign & Stamp Setup */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            padding: '22px 24px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e3a8a', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShieldCheck size={18} color="#1d68ed" />
              <span>4. Sign and Stamp Configuration</span>
            </h2>

            {/* Stamp Section */}
            <div style={{ marginBottom: 18, borderBottom: '1px solid var(--border-color)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={applyStamp}
                    onChange={(e) => setApplyStamp(e.target.checked)}
                  />
                  <span>Apply Official Shop Stamp</span>
                </label>

                {applyStamp && (
                  <button
                    onClick={() => stampInputRef.current?.click()}
                    style={{ fontSize: '0.75rem', color: '#1d68ed', fontWeight: 600 }}
                  >
                    Change Stamp Image
                  </button>
                )}
                <input
                  ref={stampInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleStampUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {applyStamp && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <img
                    src={stampImage}
                    alt="Official Stamp"
                    style={{ width: 48, height: 48, objectFit: 'contain' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Official Sri Thanu Communications Stamp active.
                  </div>
                </div>
              )}
            </div>

            {/* Signature Section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.88rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={applySignature}
                    onChange={(e) => setApplySignature(e.target.checked)}
                  />
                  <span>Apply Authorized Signature</span>
                </label>

                {applySignature && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setSignatureMode('draw')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        backgroundColor: signatureMode === 'draw' ? '#1d68ed' : '#e2e8f0',
                        color: signatureMode === 'draw' ? '#ffffff' : '#334155'
                      }}
                    >
                      Draw
                    </button>
                    <button
                      onClick={() => setSignatureMode('upload')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        backgroundColor: signatureMode === 'upload' ? '#1d68ed' : '#e2e8f0',
                        color: signatureMode === 'upload' ? '#ffffff' : '#334155'
                      }}
                    >
                      Upload
                    </button>
                    <button
                      onClick={() => setSignatureMode('text')}
                      style={{
                        padding: '3px 8px',
                        borderRadius: 4,
                        fontSize: '0.75rem',
                        backgroundColor: signatureMode === 'text' ? '#1d68ed' : '#e2e8f0',
                        color: signatureMode === 'text' ? '#ffffff' : '#334155'
                      }}
                    >
                      Type
                    </button>
                  </div>
                )}
              </div>

              {applySignature && signatureMode === 'draw' && (
                <div style={{ marginTop: 8 }}>
                  <div style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: 8,
                    backgroundColor: '#ffffff',
                    position: 'relative'
                  }}>
                    <canvas
                      ref={sigCanvasRef}
                      width={430}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      style={{ cursor: 'crosshair', display: 'block', width: '100%' }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 6,
                      right: 8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <button
                        onClick={clearSignature}
                        style={{
                          fontSize: '0.72rem',
                          color: '#64748b',
                          backgroundColor: '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: 4,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Eraser size={12} /> Clear
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                    Draw signature with your mouse or stylus inside the box.
                  </div>
                </div>
              )}

              {applySignature && signatureMode === 'upload' && (
                <div style={{ marginTop: 8 }}>
                  <button
                    onClick={() => sigUploadRef.current?.click()}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}
                  >
                    Choose Signature PNG/JPG
                  </button>
                  <input
                    ref={sigUploadRef}
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    style={{ display: 'none' }}
                  />
                  {signatureImage && (
                    <img
                      src={signatureImage}
                      alt="Signature"
                      style={{ height: 40, marginTop: 8, objectFit: 'contain' }}
                    />
                  )}
                </div>
              )}

              {applySignature && signatureMode === 'text' && (
                <div style={{ marginTop: 8 }}>
                  <input
                    type="text"
                    value={typedSignatory}
                    onChange={(e) => setTypedSignatory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--border-color)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic'
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE A4 BILL PAPER VISUAL CANVAS */}
        <div style={{
          backgroundColor: '#e2e8f0',
          padding: 24,
          borderRadius: 16,
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto'
        }}>
          {/* A4 Sheet Container */}
          <div 
            ref={printableAreaRef}
            id="printable-bill-sheet"
            style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box'
            }}
          >
            {/* Background Bill Paper (if enabled) */}
            {printPaperBackground && billPaperImage && (
              <img
                src={billPaperImage}
                alt="Letterhead Paper"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Bill Content Overlay Container */}
            <div style={{
              position: 'relative',
              zIndex: 2,
              padding: `20mm 16mm 20mm 16mm`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '297mm',
              boxSizing: 'border-box'
            }}>
              <div>
                {/* Fallback Header (Only when background is hidden) */}
                {!printPaperBackground && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '2px solid #1e3a8a',
                    paddingBottom: 16,
                    marginBottom: 20
                  }}>
                    <div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e3a8a', lineHeight: 1.1 }}>
                        Sri Thanu Communications
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#0284c7', fontWeight: 600 }}>
                        Computers, Accessories & IT Solutions
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4 }}>
                        Tech Commercial Plaza, Main Road | Phone: +91 98765 43210
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a' }}>
                        TAX INVOICE
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        Original for Recipient
                      </div>
                    </div>
                  </div>
                )}

                {/* Top spacer to align with physical letterhead header */}
                {printPaperBackground && (
                  <div style={{ height: `${Math.max(0, topMarginOffset - 40)}mm` }} />
                )}

                {/* Customer & Invoice Meta Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.4fr 1fr',
                  backgroundColor: 'rgba(248, 250, 252, 0.94)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  padding: '12px 16px',
                  marginBottom: 16
                }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase' }}>
                      Billed To Customer:
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: 2 }}>
                      {customerName || 'Walk-in Customer'}
                    </div>
                    {customerPhone && (
                      <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                        Phone: {customerPhone}
                      </div>
                    )}
                    {customerAddress && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Address: {customerAddress}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d68ed' }}>
                      INV #{invoiceNumber}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      <strong>Date:</strong> {invoiceDate}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      <strong>Payment:</strong> {paymentMode}
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  marginBottom: 16
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1e3a8a', color: '#ffffff' }}>
                      <th style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', width: 32 }}>#</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'left' }}>Item Description</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', width: 50 }}>Qty</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'right', width: 90 }}>Rate (₹)</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', width: 60 }}>GST</th>
                      <th style={{ padding: '8px 10px', fontSize: '0.78rem', fontWeight: 700, textAlign: 'right', width: 100 }}>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => {
                      const lineTotal = (Number(it.price) * Number(it.quantity)) * (1 + (Number(it.taxPercent) / 100));
                      return (
                        <tr key={it.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '8px 10px', fontSize: '0.82rem', textAlign: 'center', color: '#64748b' }}>
                            {i + 1}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                              {it.name || 'Hardware item'}
                            </div>
                            {it.serialNo && (
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 1 }}>
                                S/N: {it.serialNo}
                              </div>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
                            {it.quantity}
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.85rem', textAlign: 'right', fontWeight: 600 }}>
                            {Number(it.price).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.8rem', textAlign: 'center', color: '#64748b' }}>
                            {it.taxPercent}%
                          </td>
                          <td style={{ padding: '8px 10px', fontSize: '0.88rem', textAlign: 'right', fontWeight: 800, color: '#1e3a8a' }}>
                            {Math.round(lineTotal).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Subtotals & Grand Total Section */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                  <div style={{
                    width: 280,
                    backgroundColor: 'rgba(248, 250, 252, 0.95)',
                    padding: '10px 14px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                      <span>Subtotal:</span>
                      <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                      <span>GST (Tax):</span>
                      <span>₹ {Math.round(totalTax).toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1.05rem',
                      fontWeight: 800,
                      color: '#1e3a8a',
                      borderTop: '2px solid #cbd5e1',
                      paddingTop: 6
                    }}>
                      <span>Grand Total:</span>
                      <span>₹ {grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Amount In Words */}
                <div style={{
                  fontSize: '0.78rem',
                  fontStyle: 'italic',
                  color: '#475569',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(241, 245, 249, 0.9)',
                  borderRadius: 6,
                  marginBottom: 16
                }}>
                  <strong>Amount in Words:</strong> {numberToWords(grandTotal)}
                </div>
              </div>

              {/* Bottom Stamp, Sign & Terms Section */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                paddingTop: 14,
                borderTop: '1px solid #e2e8f0'
              }}>
                {/* Terms on Left */}
                <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: 320, lineHeight: 1.4 }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: 2 }}>Warranty & Shop Policy:</div>
                  <div>• Genuine items carrying manufacturer warranty as per brand norms.</div>
                  <div>• Retain this bill for service claim. Goods once sold are not refundable.</div>
                </div>

                {/* Sign & Stamp Box on Right */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: 200,
                  position: 'relative'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', marginBottom: 6 }}>
                    For SRI THANU COMMUNICATIONS
                  </div>

                  {/* Stamp and Signature Overlay Canvas */}
                  <div style={{
                    width: 180,
                    height: 80,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {/* Official Stamp */}
                    {applyStamp && stampImage && (
                      <img
                        src={stampImage}
                        alt="Shop Stamp"
                        style={{
                          position: 'absolute',
                          left: 10,
                          width: 72,
                          height: 72,
                          opacity: 0.88,
                          transform: 'rotate(-6deg)',
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    {/* Authorized Signature */}
                    {applySignature && (
                      <div style={{ position: 'relative', zIndex: 2 }}>
                        {signatureImage ? (
                          <img
                            src={signatureImage}
                            alt="Signature"
                            style={{ height: 46, objectFit: 'contain' }}
                          />
                        ) : (
                          <div style={{
                            fontFamily: 'cursive',
                            fontSize: '1.2rem',
                            color: '#1e3a8a',
                            fontWeight: 600,
                            paddingTop: 10
                          }}>
                            {typedSignatory}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Signatory line */}
                  <div style={{ width: 180, borderTop: '1px dashed #94a3b8', marginTop: 4 }} />
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                    Authorized Signatory & Seal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
