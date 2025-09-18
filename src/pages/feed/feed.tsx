import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectOrders,
  selectIsLoading,
  selectUserOrders,
  fetchFeeds,
  fetchUserOrders
} from '../../slices/stellarBurgerSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);
  const getFeed = () => dispatch(fetchFeeds());

  useEffect(() => {
    getFeed();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={getFeed} />;
};
