export const CATEGORIES = [
  'All Categories',
  'Laptops',
  'Desktops',
  'Monitors',
  'Accessories',
  'Components & RAM',
  'Storage (SSD / HDD)',
  'Printers',
  'Networking',
  'Power / UPS'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Laptop',
    category: 'Laptops',
    brand: 'Dell',
    processor: 'Intel Core i5',
    ram: '8 GB',
    storage: '512 GB SSD',
    screenSize: '15.6 inch',
    configuration: 'i5 | 8GB | 512GB | 15.6"',
    quantity: 10,
    price: 54990,
    costPrice: 48000,
    status: 'In Stock',
    image: '/images/products/laptop.jpg'
  },
  {
    id: 'prod-2',
    name: 'Wireless Mouse',
    category: 'Accessories',
    brand: 'Logitech',
    processor: 'N/A',
    ram: 'N/A',
    storage: 'N/A',
    screenSize: 'N/A',
    configuration: 'Wireless',
    quantity: 25,
    price: 799,
    costPrice: 550,
    status: 'In Stock',
    image: '/images/products/mouse.jpg'
  },
  {
    id: 'prod-3',
    name: 'Keyboard',
    category: 'Accessories',
    brand: 'Zebronics',
    processor: 'N/A',
    ram: 'N/A',
    storage: 'N/A',
    screenSize: 'N/A',
    configuration: 'USB',
    quantity: 15,
    price: 1299,
    costPrice: 850,
    status: 'In Stock',
    image: '/images/products/keyboard.jpg'
  },
  {
    id: 'prod-4',
    name: 'Monitor',
    category: 'Monitors',
    brand: 'Acer',
    processor: 'N/A',
    ram: 'N/A',
    storage: 'N/A',
    screenSize: '22 inch',
    configuration: '22 inch',
    quantity: 8,
    price: 8499,
    costPrice: 7100,
    status: 'In Stock',
    image: '/images/products/monitor.jpg'
  },
  {
    id: 'prod-5',
    name: '8GB RAM',
    category: 'Components & RAM',
    brand: 'Kingston',
    processor: 'N/A',
    ram: '8 GB',
    storage: 'N/A',
    screenSize: 'N/A',
    configuration: 'DDR4',
    quantity: 20,
    price: 2499,
    costPrice: 1800,
    status: 'In Stock',
    image: '/images/products/ram.jpg'
  }
];

export const PRODUCT_NAME_OPTIONS = [
  'Laptop',
  'Desktop',
  'Wireless Mouse',
  'Keyboard',
  'Monitor',
  '8GB RAM',
  '16GB RAM',
  '512GB SSD',
  '1TB HDD',
  'Gaming Headphones',
  'WiFi Router',
  'Epson Printer',
  'UPS 600VA'
];

export const PRODUCT_CONFIG_SCHEMAS = {
  'Laptop': {
    category: 'Laptops',
    description: 'Choose the configuration details for the product.',
    defaultQuantity: 10,
    defaultPrice: 54990,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Dell', 'HP', 'Lenovo', 'Acer', 'Apple', 'Asus'], defaultValue: 'Dell' },
      { id: 'processor', label: 'Processor', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7', 'Apple M2'], defaultValue: 'Intel Core i5' },
      { id: 'ram', label: 'RAM', options: ['4 GB', '8 GB', '16 GB', '32 GB'], defaultValue: '8 GB' },
      { id: 'storage', label: 'Storage', options: ['256 GB SSD', '512 GB SSD', '1 TB SSD', '1 TB HDD'], defaultValue: '512 GB SSD' },
      { id: 'screenSize', label: 'Screen Size', options: ['13.3 inch', '14 inch', '15.6 inch', '16 inch'], defaultValue: '15.6 inch' },
    ],
    formatConfig: (vals) => `${vals.processor?.replace('Intel Core ', '') || 'i5'} | ${vals.ram || '8GB'} | ${vals.storage?.replace(' SSD', '') || '512GB'} | ${vals.screenSize || '15.6"'}`
  },
  'Desktop': {
    category: 'Desktops',
    description: 'Choose processor, memory, storage and cabinet for desktop.',
    defaultQuantity: 5,
    defaultPrice: 42990,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Dell', 'HP', 'Lenovo', 'Custom Assembled', 'Acer', 'Apple'], defaultValue: 'Dell' },
      { id: 'processor', label: 'Processor', options: ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'AMD Ryzen 7'], defaultValue: 'Intel Core i5' },
      { id: 'ram', label: 'RAM', options: ['8 GB', '16 GB', '32 GB', '64 GB'], defaultValue: '16 GB' },
      { id: 'storage', label: 'Storage', options: ['512 GB SSD', '1 TB SSD', '1 TB HDD', '2 TB HDD'], defaultValue: '512 GB SSD' },
      { id: 'cabinet', label: 'Case Type', options: ['Tower Cabinet', 'Small Form Factor (SFF)', 'All-in-One (AIO)'], defaultValue: 'Tower Cabinet' },
    ],
    formatConfig: (vals) => `${vals.processor?.replace('Intel Core ', '') || 'i5'} | ${vals.ram || '16GB'} | ${vals.storage || '512GB'}`
  },
  'Wireless Mouse': {
    category: 'Accessories',
    description: 'Choose connectivity, sensor DPI and brand details for the mouse.',
    defaultQuantity: 25,
    defaultPrice: 799,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Logitech', 'Dell', 'HP', 'Zebronics', 'Lenovo', 'Portronics'], defaultValue: 'Logitech' },
      { id: 'connectivity', label: 'Connectivity', options: ['Wireless 2.4GHz', 'Bluetooth + Wireless', 'USB Wired'], defaultValue: 'Wireless' },
      { id: 'dpi', label: 'Sensor DPI', options: ['1000 DPI', '1600 DPI High Precision', '2400 DPI Gaming'], defaultValue: '1600 DPI High Precision' },
      { id: 'style', label: 'Color / Style', options: ['Matte Black', 'Silent Click', 'Ergonomic Grip'], defaultValue: 'Matte Black' },
      { id: 'battery', label: 'Battery Type', options: ['AA Battery Included', 'Rechargeable Type-C', 'AAA Battery'], defaultValue: 'AA Battery Included' },
    ],
    formatConfig: (vals) => 'Wireless'
  },
  'Keyboard': {
    category: 'Accessories',
    description: 'Select keyboard connectivity, switch type and layout.',
    defaultQuantity: 15,
    defaultPrice: 1299,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Zebronics', 'Logitech', 'Dell', 'HP', 'TVS Gold', 'Redragon'], defaultValue: 'Zebronics' },
      { id: 'connectivity', label: 'Connectivity', options: ['USB Wired', '2.4GHz Wireless', 'Bluetooth Multi-Device'], defaultValue: 'USB Wired' },
      { id: 'keyType', label: 'Key Type', options: ['Standard Membrane', 'Mechanical Blue Switch', 'Slim Chiclet'], defaultValue: 'Standard Membrane' },
      { id: 'layout', label: 'Layout', options: ['Full-Size (104 Keys)', 'Compact (87 Keys)', 'Multimedia'], defaultValue: 'Full-Size (104 Keys)' },
      { id: 'backlight', label: 'Backlight', options: ['Non-Backlit', 'RGB Backlit LED', 'Single White LED'], defaultValue: 'Non-Backlit' },
    ],
    formatConfig: (vals) => 'USB'
  },
  'Monitor': {
    category: 'Monitors',
    description: 'Choose display size, resolution, refresh rate and panel type.',
    defaultQuantity: 8,
    defaultPrice: 8499,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Acer', 'Dell', 'Samsung', 'LG', 'HP', 'BenQ'], defaultValue: 'Acer' },
      { id: 'screenSize', label: 'Screen Size', options: ['21.5 inch', '22 inch', '24 inch', '27 inch', '32 inch Curved'], defaultValue: '22 inch' },
      { id: 'resolution', label: 'Resolution', options: ['Full HD 1080p', '2K QHD', '4K Ultra HD'], defaultValue: 'Full HD 1080p' },
      { id: 'refreshRate', label: 'Refresh Rate', options: ['60Hz', '75Hz Smooth', '100Hz', '144Hz Gaming'], defaultValue: '75Hz Smooth' },
      { id: 'panel', label: 'Panel Type', options: ['IPS Wide-View', 'VA High Contrast', 'TN Fast Response'], defaultValue: 'IPS Wide-View' },
    ],
    formatConfig: (vals) => vals.screenSize || '22 inch'
  },
  '8GB RAM': {
    category: 'Components & RAM',
    description: 'Select RAM brand, memory generation, speed and form factor.',
    defaultQuantity: 20,
    defaultPrice: 2499,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Kingston', 'Crucial', 'Corsair', 'Samsung', 'G.Skill'], defaultValue: 'Kingston' },
      { id: 'memoryType', label: 'Memory Type', options: ['DDR4', 'DDR5', 'DDR3'], defaultValue: 'DDR4' },
      { id: 'capacity', label: 'Capacity', options: ['8 GB', '16 GB', '32 GB', '4 GB'], defaultValue: '8 GB' },
      { id: 'speed', label: 'Bus Speed', options: ['2666 MHz', '3200 MHz', '3600 MHz', '4800 MHz', '5600 MHz'], defaultValue: '3200 MHz' },
      { id: 'formFactor', label: 'Form Factor', options: ['Desktop (UDIMM)', 'Laptop (SO-DIMM)'], defaultValue: 'Desktop (UDIMM)' },
    ],
    formatConfig: (vals) => vals.memoryType || 'DDR4'
  },
  '16GB RAM': {
    category: 'Components & RAM',
    description: 'Select RAM brand, memory generation, speed and form factor.',
    defaultQuantity: 15,
    defaultPrice: 3899,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Kingston', 'Crucial', 'Corsair', 'Samsung', 'G.Skill'], defaultValue: 'Kingston' },
      { id: 'memoryType', label: 'Memory Type', options: ['DDR4', 'DDR5'], defaultValue: 'DDR4' },
      { id: 'capacity', label: 'Capacity', options: ['16 GB', '32 GB'], defaultValue: '16 GB' },
      { id: 'speed', label: 'Bus Speed', options: ['3200 MHz', '3600 MHz', '4800 MHz', '5600 MHz'], defaultValue: '3200 MHz' },
      { id: 'formFactor', label: 'Form Factor', options: ['Desktop (UDIMM)', 'Laptop (SO-DIMM)'], defaultValue: 'Desktop (UDIMM)' },
    ],
    formatConfig: (vals) => `${vals.memoryType || 'DDR4'} | 16GB`
  },
  '512GB SSD': {
    category: 'Storage (SSD / HDD)',
    description: 'Choose SSD interface type, form factor and transfer speed.',
    defaultQuantity: 15,
    defaultPrice: 3499,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Kingston', 'Samsung', 'Crucial', 'Western Digital (WD)', 'SanDisk'], defaultValue: 'Kingston' },
      { id: 'interface', label: 'Interface', options: ['M.2 NVMe PCIe Gen3', 'M.2 NVMe PCIe Gen4', '2.5" SATA III SSD', 'External USB-C'], defaultValue: 'M.2 NVMe PCIe Gen3' },
      { id: 'capacity', label: 'Capacity', options: ['512 GB', '256 GB', '1 TB', '2 TB'], defaultValue: '512 GB' },
      { id: 'speed', label: 'Read Speed', options: ['Up to 2400 MB/s', 'Up to 3500 MB/s', 'Up to 7000 MB/s'], defaultValue: 'Up to 3500 MB/s' },
      { id: 'warranty', label: 'Warranty', options: ['3 Years Limited', '5 Years Manufacturer'], defaultValue: '5 Years Manufacturer' },
    ],
    formatConfig: (vals) => '512GB NVMe SSD'
  },
  '1TB HDD': {
    category: 'Storage (SSD / HDD)',
    description: 'Choose hard disk brand, RPM speed and form factor.',
    defaultQuantity: 12,
    defaultPrice: 3199,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Western Digital (WD)', 'Seagate Barracuda', 'Toshiba'], defaultValue: 'Western Digital (WD)' },
      { id: 'formFactor', label: 'Form Factor', options: ['3.5" Desktop SATA', '2.5" Laptop SATA', 'External USB 3.0'], defaultValue: '3.5" Desktop SATA' },
      { id: 'capacity', label: 'Capacity', options: ['1 TB', '2 TB', '4 TB'], defaultValue: '1 TB' },
      { id: 'rpm', label: 'RPM Speed', options: ['7200 RPM High Performance', '5400 RPM Quiet'], defaultValue: '7200 RPM High Performance' },
      { id: 'cache', label: 'Cache Buffer', options: ['64 MB Cache', '128 MB Cache', '256 MB Cache'], defaultValue: '64 MB Cache' },
    ],
    formatConfig: (vals) => '1TB | 7200 RPM'
  },
  'Gaming Headphones': {
    category: 'Accessories',
    description: 'Select headphone connectivity, audio drivers, mic and lighting.',
    defaultQuantity: 12,
    defaultPrice: 1599,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Zebronics', 'Redragon', 'Logitech', 'Cosmic Byte', 'Sony'], defaultValue: 'Zebronics' },
      { id: 'connectivity', label: 'Connectivity', options: ['3.5mm Audio + USB', 'USB 7.1 Virtual Surround', 'Bluetooth Wireless'], defaultValue: '3.5mm Audio + USB' },
      { id: 'drivers', label: 'Driver Size', options: ['50mm Deep Bass Drivers', '40mm Neodymium Drivers'], defaultValue: '50mm Deep Bass Drivers' },
      { id: 'mic', label: 'Microphone', options: ['Adjustable Noise Isolating Mic', 'Detachable Mic'], defaultValue: 'Adjustable Noise Isolating Mic' },
      { id: 'rgb', label: 'Lighting', options: ['RGB Breathing LED', 'Fixed Blue LED', 'Non-RGB Stealth'], defaultValue: 'RGB Breathing LED' },
    ],
    formatConfig: (vals) => 'RGB | 50mm'
  },
  'WiFi Router': {
    category: 'Networking',
    description: 'Choose router wireless speed, bandwidth and antenna coverage.',
    defaultQuantity: 8,
    defaultPrice: 2299,
    fields: [
      { id: 'brand', label: 'Brand', options: ['TP-Link', 'D-Link', 'Netgear', 'Tenda', 'ASUS'], defaultValue: 'TP-Link' },
      { id: 'speed', label: 'Wireless Speed', options: ['AC1200 Dual-Band', 'AX1500 Wi-Fi 6', 'N300 Single-Band'], defaultValue: 'AC1200 Dual-Band' },
      { id: 'antennas', label: 'Antennas', options: ['4 High-Gain 5dBi Antennas', '2 Omni Antennas', '6 Antennas'], defaultValue: '4 High-Gain 5dBi Antennas' },
      { id: 'ports', label: 'LAN Ports', options: ['4 Gigabit LAN + 1 WAN', '3 Fast Ethernet Ports'], defaultValue: '4 Gigabit LAN + 1 WAN' },
      { id: 'features', label: 'Security', options: ['WPA3 Encryption + Parental Controls', 'Standard WPA2'], defaultValue: 'WPA3 Encryption + Parental Controls' },
    ],
    formatConfig: (vals) => 'AC1200 Dual-Band'
  },
  'Epson Printer': {
    category: 'Printers',
    description: 'Choose all-in-one printer features, wireless capability and output.',
    defaultQuantity: 4,
    defaultPrice: 13499,
    fields: [
      { id: 'brand', label: 'Brand', options: ['Epson', 'HP', 'Canon', 'Brother'], defaultValue: 'Epson' },
      { id: 'type', label: 'Printer Type', options: ['EcoTank All-in-One (Print/Scan/Copy)', 'Mono Laser Printer', 'Wireless Ink Tank'], defaultValue: 'EcoTank All-in-One (Print/Scan/Copy)' },
      { id: 'connectivity', label: 'Connectivity', options: ['WiFi + USB + Mobile Print', 'USB 2.0 High Speed'], defaultValue: 'WiFi + USB + Mobile Print' },
      { id: 'output', label: 'Print Output', options: ['Color & Black/White', 'Monochrome B&W Only'], defaultValue: 'Color & Black/White' },
      { id: 'speed', label: 'Print Speed', options: ['Up to 33 ppm (Draft)', 'Up to 15 ipm (ISO)'], defaultValue: 'Up to 33 ppm (Draft)' },
    ],
    formatConfig: (vals) => 'EcoTank AIO | WiFi'
  },
  'UPS 600VA': {
    category: 'Power / UPS',
    description: 'Select UPS capacity, battery backup time and surge protection.',
    defaultQuantity: 6,
    defaultPrice: 3299,
    fields: [
      { id: 'brand', label: 'Brand', options: ['APC by Schneider', 'Microtek', 'Luminous', 'Zebronics'], defaultValue: 'APC by Schneider' },
      { id: 'capacity', label: 'Capacity', options: ['600VA / 360W', '1000VA / 600W', '1100VA / 660W'], defaultValue: '600VA / 360W' },
      { id: 'backup', label: 'Backup Time', options: ['15 to 25 Mins (PC + Monitor)', '30 to 45 Mins'], defaultValue: '15 to 25 Mins (PC + Monitor)' },
      { id: 'outlets', label: 'Power Outlets', options: ['3 Battery Backup Outlets', '4 Outlets with Surge Protection'], defaultValue: '3 Battery Backup Outlets' },
      { id: 'avr', label: 'Stabilizer', options: ['Automatic Voltage Regulator (AVR)', 'Standard Protection'], defaultValue: 'Automatic Voltage Regulator (AVR)' },
    ],
    formatConfig: (vals) => '600VA | AVR'
  }
};

export const AUTHORIZED_USERS = [
  {
    id: 'u-1',
    role: 'Admin (owner)',
    name: 'Chandrakanth',
    email: 'chandrakanthyaddhula@gmail.com',
    password: 'XttupL&i25@'
  }
];

export const DEFAULT_SETTINGS = {
  shopName: 'Sri Thanu Communications',
  tagline: 'Your one-stop shop for computers, accessories and IT solutions',
  ownerName: 'Chandrakanth',
  role: 'Admin',
  phone: '+91 98765 43210',
  email: 'chandrakanthyaddhula@gmail.com',
  address: 'Shop No. 12, Tech Commercial Plaza, Main Road',
  gstNumber: '36AAACS1234F1ZP',
  currency: '₹',
  taxRate: 18,
  taxEnabled: true,
  invoiceFooterNote: 'Thank you for choosing Sri Thanu Communications! Genuine products with manufacturer warranty.'
};
