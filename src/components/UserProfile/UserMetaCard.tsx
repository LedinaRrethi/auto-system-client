
import { useAuth } from "../../hooks/useAuth";

export default function UserMetaCard() {
   const { user } = useAuth();
  
    const fullName = user?.FullName;

    const firstName = user?.FullName?.split(" ")[0];

  const lastName = user?.FullName?.split(" ")[1];


    const role = user?.role;

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
             <div className="relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
          <span className="font-semibold text-2xl text-gray-600 dark:text-gray-300">
            {(firstName?.[0]?.toUpperCase() || "") + (lastName?.[0]?.toUpperCase() || "")}
          </span>
        </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {fullName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Role
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {role}
                </p>
              </div>
            </div>
          
            </div>
          </div>

        </div>
    </>
  );
}
