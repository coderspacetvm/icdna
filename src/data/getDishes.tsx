import {URLS} from '../config';

export async function getDishes() {
  const response = await fetch(URLS.GET_DISHES);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const json = await response.json();
  return json.dishes;
}
