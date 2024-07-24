import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { periodType } from "../lib/types/types";
import { formatDateNorwegian } from "../lib/utils/dateUtils";
import Button from "./Button";
import CheckIcon from "./icons/icons/CheckIcon";

interface Props {
  period: periodType;
}

const PeriodCard = ({ period }: Props) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (session?.user?.owId) {
        const response = await fetch(
          `/api/applicants/${period._id}/${session.user.owId}`
        );
        if (response.ok) {
          const data = await response.json();
          setHasApplied(data.exists);
          setIsLoading(false);
        }
      }
    };

    if (period._id && session?.user?.owId) {
      checkApplicationStatus();
    }
  }, [period._id, session?.user?.owId]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md p-4 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700 ">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto break-words border rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <div className="flex flex-col justify-between h-full p-4">
        <div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-online-snowWhite">
            {period.name}
          </h3>
          <p className="w-full mt-1 text-gray-500 dark:text-gray-200">
            {period.description}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
            Søknadsperiode:{" "}
            {formatDateNorwegian(period.applicationPeriod.start)} -{" "}
            {formatDateNorwegian(period.applicationPeriod.end)}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
            Intervjuperiode: {formatDateNorwegian(period.interviewPeriod.start)}{" "}
            - {formatDateNorwegian(period.interviewPeriod.end)}
          </p>
        </div>
        {hasApplied && (
          <span className="absolute flex items-center justify-center gap-2 px-3 py-1 text-green-600 bg-green-100 rounded-full top-4 right-4 dark:bg-green-800 shrink-0 dark:text-green-300">
            Søkt
            <CheckIcon className="w-3 h-3" />
          </span>
        )}
        <div className="flex justify-center mt-4">
          <Button
            title={hasApplied ? "Se søknad" : "Søk nå"}
            size="small"
            color="white"
            href={`/application/${period._id}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PeriodCard;
