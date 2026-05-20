import { FC } from 'react';
import { format } from 'date-fns';
import { OrderItem as OrderItemObj, Part } from '@/types';

interface OrderItemProps {
  item: OrderItemObj;
  part: Part | undefined;
}

const OrderItem: FC<OrderItemProps> = ({ item, part }) => {

  return (
    <div className="flex flex-row flex-wrap justify-center text-xs lg:text-sm gap-6 lg:justify-between w-full border-t border-gray-200 dark:border-gray-700 pt-4">
        <dl className="">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Part:</dt>
            <dd className="mt-1.5 font-semibold text-gray-900 dark:text-white">
                <p>{part ? part.partName : "Unknown"}</p>
            </dd>
        </dl>

        <dl className="">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Quantity:</dt>
            <dd className="mt-1.5 font-semibold text-gray-900 dark:text-white">{item ? item.quantity : 0}</dd>
        </dl>

        <dl className="">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Price:</dt>
            <dd className="mt-1.5 font-semibold text-gray-900 dark:text-white">{item ? `${item.unitPrice} EGP` : "Unknown"}</dd>
        </dl>

        <dl className="">
            <dt className="font-medium text-gray-500 dark:text-gray-400">Total:</dt>
            <dd className="mt-1.5 font-semibold text-gray-900 dark:text-white">{item ? `${item.totalPrice} EGP` : "Unknown"}</dd>
        </dl>
    </div>
  )
}

export default OrderItem;
