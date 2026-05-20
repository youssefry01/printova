import { FC } from 'react';
import { format } from 'date-fns';
import { Maintenance as MaintenanceObj } from '@/types';

const Maintenance: FC<{ maintenance: MaintenanceObj }> = ({ maintenance }) => {

  return (
    <div className="flex flex-wrap m-2 gap-y-4 pb-4 md:pb-5 rounded-lg border my-4 text-center lg:text-start items-center border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 md:p-8">
      
      <div className='flex flex-wrap flex-row w-full justify-center gap-6 lg:justify-between items-center mb-4'>
        <dl className="">
            <dt className="text-sm lg:text-base font-semibold text-black dark:text-white">Maintenance Id: </dt>
            <dd className="text-xs lg:text-sm text-gray-500 dark:text-white">{maintenance ? maintenance.maintenanceId : "Unknown"}</dd>
        </dl>
        <dl className="">
            <dt className="text-sm lg:text-base font-semibold text-black dark:text-white">Maintenance Status: </dt>
            <dd className={`text-xs font-medium px-2 py-0.5 rounded-full inline-block mt-1 ${maintenance?.maintenanceStatus === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400'}`}>
              {maintenance && maintenance.maintenanceStatus ? maintenance.maintenanceStatus : "Unknown"}
            </dd>
        </dl>
        <dl className="">
            <dt className="text-sm lg:text-base font-semibold text-black dark:text-white">Scheduled At: </dt>
            <dd className="text-xs text-gray-500 dark:text-white">{maintenance && maintenance.date ? format(new Date(maintenance.date), "PPpp") : "Unknown"}</dd>
        </dl>
        <dl className="">
            <dt className="text-sm lg:text-base font-semibold text-black dark:text-white">Completed At: </dt>
            <dd className="text-xs text-gray-500 dark:text-white">{maintenance && maintenance.completedAt ? format(new Date(maintenance.completedAt), "PPpp") : "Not Completed"}</dd>
        </dl>
        <dl className="">
            <dt className="text-sm lg:text-base font-semibold text-black dark:text-white">Total Amount: </dt>
            <dd className="text-xs lg:text-sm text-gray-500 dark:text-white">{maintenance && maintenance.totalAmount ? `${maintenance.totalAmount} EGP` : "Unknown"}</dd>
        </dl>
      </div>

      <div className=''>
        <dl className="">
            <dt className="text-sm lg:text-base font-semibold text-black dark:text-white">Description: </dt>
            <dd className="text-sm text-gray-700 dark:text-gray-300">{maintenance && maintenance.description ? maintenance.description : "No description available"}</dd>
        </dl>
      </div>

    </div>
  )
}

export default Maintenance;
