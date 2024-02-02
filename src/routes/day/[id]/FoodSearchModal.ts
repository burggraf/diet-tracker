import { pb } from '$services/backend.service'
export const search_food_log = async (s: string) => {
    const { data, error } = await pb.send('/food_search', {
        method: 'POST',
        body: {
            search_string: s,
        },
    })
    console.log('search_food_log', data, error)
    return { data, error }
}

export const search_internet = async (s: string) => {
    let data = [];
    let error = null;
    let url = '';
    let isupc = false;
    // check if we have a barcode
    if (s.match(/^[0-9]+$/)) {
      url = 'https://us.openfoodfacts.org/api/v0/product/' + s.trim() + '.json';
      isupc = true;
    } else {
      url = `https://us.openfoodfacts.org/cgi/search.pl?search_terms=${s}&search_simple=1&action=process&json=1&nutriment_0=energy-kcal&nutriment_compare_0=gt&nutriment_value_0=500&fields=code,product_name,nutriments,serving_size&sort_by=product_name`;
    }
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (!response.ok) {
        console.error('** fetch ERROR **', response.statusText);
        error = response.statusText;
        return ({ data: null, error });
      }
      if (isupc) {
        json.products = [json.product];
      }
      if (json && json.products) {
        for (let i = 0; i < json.products.length; i++) {
          const product = json.products[i];     
          let desc = product.serving_size || '';
          if (product.nutriments["energy-kcal_100g"]) {
            if (desc.length > 0) desc += ' - ';
            desc += `${Math.round(product.nutriments["energy-kcal_100g"])} cal/100g`;
          } 
          let calories = product.nutriments['energy-kcal_serving'] || product.nutriments['energy-kcal'];
          if (calories) {
            calories = Math.round(calories);
          } else {
            calories = '???';
          }    
          data.push({
            title: product.product_name,
            calories: calories,
            desc: desc
          })
        }
      }  
    } catch (err: any) {
      console.error('** search_internet error **', err);
      const simpleError = (err.toString() + '\n').split('\n')[0];
      console.error('line 1', simpleError)
      error = simpleError;
    }    
    return { data, error };  
  }
