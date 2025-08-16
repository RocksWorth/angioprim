import { NextRequest, NextResponse } from 'next/server';

// Simple validation functions
function validateAddress(address: any) {
  if (!address || typeof address !== 'object') return false;
  if (!address.name || !address.address1 || !address.city || !address.province || !address.postalCode || !address.country) return false;
  return true;
}

function validateCartItems(items: any) {
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every(item => 
    item.id && item.productId && item.name && 
    typeof item.price === 'number' && typeof item.quantity === 'number'
  );
}

// Canada Post API integration for real shipping rates
async function getCanadaPostRates(address: any, items: any[]) {
  // Calculate package weight and dimensions
  const packageWeight = items.reduce((total, item) => {
    const baseWeight = getProductWeight(item.productId, item.options);
    return total + (baseWeight * item.quantity);
  }, 0);

  const packageValue = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // For Canada Post API, you need:
  // 1. Customer number from Canada Post
  // 2. API credentials
  // 3. Origin postal code (your business address)
  
  const originPostalCode = process.env.ORIGIN_POSTAL_CODE || 'M5V3A1'; // Default Toronto
  const customerNumber = process.env.CANADA_POST_CUSTOMER_NUMBER;
  const username = process.env.CANADA_POST_USERNAME;
  const password = process.env.CANADA_POST_PASSWORD;

  // If no Canada Post credentials, fall back to calculated rates
  if (!customerNumber || !username || !password) {
    console.log('Canada Post API credentials not found, using calculated rates');
    return getCalculatedRates(address, items, packageWeight, packageValue);
  }

  try {
    // Prepare Canada Post API request
    const rateRequest = {
      'mailing-scenario': {
        'customer-number': customerNumber,
        'parcel-characteristics': {
          'weight': Math.max(0.1, packageWeight), // Minimum 0.1kg
          'dimensions': {
            'length': 30, // cm - adjust based on your products
            'width': 20,
            'height': 5,
          },
        },
        'origin-postal-code': originPostalCode,
        'destination': {
          'country-code': address.country || 'CA',
          'postal-code': address.postalCode.replace(/\s/g, ''),
        },
      },
    };

    // Call Canada Post Rating API
    const response = await fetch('https://ct.soa-gw.canadapost.ca/rs/ship/price', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
        'Content-Type': 'application/vnd.cpc.ship.rate-v4+xml',
        'Accept': 'application/vnd.cpc.ship.rate-v4+xml',
      },
      body: buildCanadaPostXML(rateRequest),
    });

    if (!response.ok) {
      throw new Error(`Canada Post API error: ${response.status}`);
    }

    const xmlData = await response.text();
    const rates = parseCanadaPostResponse(xmlData);
    
    return rates;
  } catch (error) {
    console.error('Canada Post API error:', error);
    // Fall back to calculated rates
    return getCalculatedRates(address, items, packageWeight, packageValue);
  }
}

// Fallback calculated rates (your original logic)
function getCalculatedRates(address: any, items: any[], packageWeight: number, packageValue: number) {
  const zone = getShippingZone(address.postalCode, address.province);
  
  const baseRates = [
    {
      id: 'canada-post-regular',
      name: 'Canada Post Regular Parcel',
      description: 'Standard delivery',
      carrier: 'Canada Post',
      basePrice: 1299, // $12.99
      estimatedDays: '5-8 business days',
    },
    {
      id: 'canada-post-expedited',
      name: 'Canada Post Expedited Parcel',
      description: 'Faster delivery',
      carrier: 'Canada Post',
      basePrice: 1899, // $18.99
      estimatedDays: '2-3 business days',
    },
    {
      id: 'canada-post-priority',
      name: 'Canada Post Priority',
      description: 'Next business day',
      carrier: 'Canada Post',
      basePrice: 2999, // $29.99
      estimatedDays: '1 business day',
    },
  ];

  const rates = baseRates.map(rate => {
    let finalPrice = rate.basePrice;
    
    // Weight adjustment
    if (packageWeight > 0.5) {
      finalPrice += Math.ceil((packageWeight - 0.5) * 10) * 200; // $2 per 100g over 500g
    }
    
    // Zone adjustment
    switch (zone) {
      case 'local':
        finalPrice *= 1.0;
        break;
      case 'regional':
        finalPrice *= 1.3;
        break;
      case 'national':
        finalPrice *= 1.6;
        break;
      case 'remote':
        finalPrice *= 2.2;
        break;
    }
    
    // Free shipping threshold
    if (packageValue >= 7500) { // $75+ orders
      finalPrice = Math.max(0, finalPrice - 1299); // $12.99 discount
    }
    
    return {
      ...rate,
      price: Math.round(finalPrice),
    };
  });

  return rates.sort((a, b) => a.price - b.price);
}

// Build XML for Canada Post API
function buildCanadaPostXML(rateRequest: any): string {
  const scenario = rateRequest['mailing-scenario'];
  const parcel = scenario['parcel-characteristics'];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">
  <customer-number>${scenario['customer-number']}</customer-number>
  <parcel-characteristics>
    <weight>${parcel.weight}</weight>
    <dimensions>
      <length>${parcel.dimensions.length}</length>
      <width>${parcel.dimensions.width}</width>
      <height>${parcel.dimensions.height}</height>
    </dimensions>
  </parcel-characteristics>
  <origin-postal-code>${scenario['origin-postal-code']}</origin-postal-code>
  <destination>
    <country-code>${scenario.destination['country-code']}</country-code>
    <postal-code>${scenario.destination['postal-code']}</postal-code>
  </destination>
</mailing-scenario>`;
}

// Parse Canada Post XML response
function parseCanadaPostResponse(xmlData: string) {
  // Simple XML parsing - in production, use a proper XML parser
  const rates: any[] = [];
  
  // This is a simplified parser - you should use xml2js or similar library
  const serviceRegex = /<service-code>(.*?)<\/service-code>[\s\S]*?<service-name>(.*?)<\/service-name>[\s\S]*?<price-details>[\s\S]*?<due>(.*?)<\/due>/g;
  
  let match;
  while ((match = serviceRegex.exec(xmlData)) !== null) {
    const [, serviceCode, serviceName, priceInCents] = match;
    
    rates.push({
      id: `canada-post-${serviceCode.toLowerCase()}`,
      name: serviceName,
      description: getServiceDescription(serviceCode),
      carrier: 'Canada Post',
      price: parseInt(priceInCents) || 0,
      estimatedDays: getEstimatedDays(serviceCode),
    });
  }
  
  return rates.length > 0 ? rates : null;
}

function getServiceDescription(serviceCode: string): string {
  const descriptions: Record<string, string> = {
    'DOM.RP': 'Regular Parcel',
    'DOM.EP': 'Expedited Parcel', 
    'DOM.XP': 'Xpresspost',
    'DOM.PC': 'Priority',
    'DOM.LIB': 'Library Materials',
  };
  return descriptions[serviceCode] || 'Standard delivery';
}

function getEstimatedDays(serviceCode: string): string {
  const deliveryTimes: Record<string, string> = {
    'DOM.RP': '5-8 business days',
    'DOM.EP': '4-7 business days',
    'DOM.XP': '1-2 business days',
    'DOM.PC': 'Next business day',
    'DOM.LIB': '5-10 business days',
  };
  return deliveryTimes[serviceCode] || '3-7 business days';
}

function getProductWeight(productId: string, options: any): number {
  // Weight in kg based on product type and options
  const weights: Record<string, number> = {
    'business-cards': 0.1,
    'flyers': 0.05,
    'postcards': 0.03,
    'stickers': 0.02,
    'posters': 0.3,
    'brochures': 0.15,
  };
  
  const baseWeight = weights[productId] || 0.1;
  
  // Adjust for paper type/thickness
  if (options.paperType) {
    switch (options.paperType) {
      case '18pt-writable':
      case '14pt-matte':
        return baseWeight * 1.5;
      case '100lb-gloss':
        return baseWeight * 1.3;
      default:
        return baseWeight;
    }
  }
  
  return baseWeight;
}

function getShippingZone(postalCode: string, province: string): string {
  // Simplified zone calculation - in real app, use proper postal code database
  const cleanPostal = postalCode.replace(/\s/g, '').toUpperCase();
  const firstChar = cleanPostal.charAt(0);
  
  // This is a simplified version - real implementation would use detailed postal code ranges
  if (province === 'ON' && ['K', 'L', 'M', 'N', 'P'].includes(firstChar)) {
    return 'local';
  }
  
  if (['K', 'L', 'M', 'N', 'P', 'G', 'H', 'J'].includes(firstChar)) {
    return 'regional';
  }
  
  if (['R', 'S', 'T', 'V'].includes(firstChar)) {
    return 'national';
  }
  
  // Territories and remote areas
  if (['X', 'Y'].includes(firstChar)) {
    return 'remote';
  }
  
  return 'national';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, items } = body;
    
    // Validate request data
    if (!validateAddress(address)) {
      return NextResponse.json(
        { error: 'Invalid shipping address' },
        { status: 400 }
      );
    }
    
    if (!validateCartItems(items)) {
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }
    
    // Get shipping rates from Canada Post API (with fallback)
    const rates = await getCanadaPostRates(address, items);
    
    // In a real application, you would integrate with actual shipping APIs:
    // - Canada Post API
    // - UPS API
    // - FedEx API
    // - Purolator API
    
    return NextResponse.json({
      success: true,
      rates,
      address,
      packageInfo: {
        weight: items.reduce((total, item) => {
          return total + (getProductWeight(item.productId, item.options) * item.quantity);
        }, 0),
        value: items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0),
      },
    });
    
  } catch (error) {
    console.error('Shipping rates calculation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to calculate shipping rates' },
      { status: 500 }
    );
  }
}

// For development/testing - GET endpoint to test rate calculation
export async function GET() {
  const testAddress = {
    name: 'Test User',
    address1: '123 Main St',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'M5V 3A1',
    country: 'CA',
  };
  
  const testItems = [
    {
      id: '1',
      productId: 'business-cards',
      name: 'Business Cards',
      price: 2499,
      quantity: 1,
      options: { paperType: '14pt-matte', sides: 'double' },
    },
  ];
  
  // Calculate package weight for test
  const packageWeight = testItems.reduce((total, item) => {
    const baseWeight = getProductWeight(item.productId, item.options);
    return total + (baseWeight * item.quantity);
  }, 0);

  const packageValue = testItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const rates = getCalculatedRates(testAddress, testItems, packageWeight, packageValue);
  
  return NextResponse.json({
    message: 'Shipping rates API test',
    testRates: rates,
    testAddress,
    testItems,
    packageInfo: {
      weight: packageWeight,
      value: packageValue,
    },
  });
}
