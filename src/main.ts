interface Data {
  conversion_rates: Record<string, number>;
}

class FetchWrapper {
  baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  get(endpoint: string): Promise<Data> {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint: string, body: any): Promise<any> {
    return this._send('put', endpoint, body);
  }

  post(endpoint: string, body: any): Promise<any> {
    return this._send('post', endpoint, body);
  }

  delete(endpoint: string, body: any): Promise<any> {
    return this._send('delete', endpoint, body);
  }

  _send(method: string, endpoint: string, body: any): Promise<any> {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

// TODO: WRITE YOUR TYPESCRIPT CODE HERE

// A global variable that references the HTML select element with the id base-currency
const baseCurrency = document.getElementById('base-currency') as HTMLSelectElement;

// A global variable that references the HTML select element with the id target-currency
const targetCurrency = document.getElementById('target-currency') as HTMLSelectElement;

// A global variable that references the HTML paragraph element with the id conversion-result
const conversionResult = document.getElementById('conversion-result') as HTMLParagraphElement;

// A constant that stores the API key for authentication
const API_KEY = import.meta.env.VITE_API_KEY;

// An instance of the FetchWrapper class with the base URL of the API
const baseURL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`;
const fetchWrapper = new FetchWrapper(baseURL);

// A call to the get method of the API instance with the endpoint that requests the latest conversion rates for the USD currency
fetchWrapper.get('USD')
  .then(data => {
    console.log('Conversion rates for USD:', data.conversion_rates); // check
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });


async function getConversionRates(base: string) {
  try {
    const data = await fetchWrapper.get(base);
    const rates = data.conversion_rates;

    if (!rates) {
      throw new Error('No conversion rates available');
    }
    console.log(`Conversion rates for ${base}:`, rates);
    return rates;
  } catch (error) {
    console.error('Error fetching data:', error);
    return {}; // return empty object, if there's an error
  }
}

baseCurrency.addEventListener('change', updateConversionResult);
targetCurrency.addEventListener('change', updateConversionResult);

function updateConversionResult() {
  const base = baseCurrency.value;
  const target = targetCurrency.value;

  getConversionRates(base)
    .then((rates) => {
      if (rates && rates[target]) {
        const conversionRate = rates[target];
        conversionResult.textContent = conversionRate.toFixed(4);  // 4 decimal places
      } else {
        conversionResult.textContent = "Rate is not available";
      }
    });
}

updateConversionResult();