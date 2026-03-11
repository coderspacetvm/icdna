import type {MenuType} from '../types';
import type {DishType} from '../types';
import type {ReviewType} from '../types';
import type {OrderType} from '../types';
import type {CarouselType} from '../types';
import type {PromocodeType} from '../types';
import type {NotificationType} from '../types';

export type DataStateType = {
  menu: MenuType[];
  orders: OrderType[];
  dishes: DishType[];
  promocodes: PromocodeType[];
  carousel: CarouselType[];
  reviews: ReviewType[];
  notifications: NotificationType[];
  setData: (data: {
    menu: MenuType[];
    orders: OrderType[];
    dishes: DishType[];
    promocodes: PromocodeType[];
    carousel: CarouselType[];
    reviews: ReviewType[];
    notifications: NotificationType[];
  }) => void;
};
