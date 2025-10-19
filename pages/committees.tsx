import { useEffect, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { OwCommittee, periodType } from "../lib/types/types";
import CommitteeAboutCard from "../components/CommitteeAboutCard";
import { useQuery } from "@tanstack/react-query";
import { fetchOwCommittees } from "../lib/api/committeesApi";
import ErrorPage from "../components/ErrorPage";
import { fetchPeriods } from "../lib/api/periodApi";
import { MainTitle } from "../components/Typography";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Tabs } from "../components/Tabs";
import { UserIcon, BellAlertIcon } from "@heroicons/react/24/solid";
import { shuffleList } from "../lib/utils/shuffleList";

const excludedCommittees = ["Faddere", "Output"];

const otherCommittees = ["Jubkom", "Velkom", "Ekskom", "Debug"];

const hasPeriod = (committee: OwCommittee, periods: periodType[]) => {
  if (!Array.isArray(periods)) return false;

  const today = new Date();

  if (committee.name_short === "Bankom") {
    return periods.some((period) => {
      const applicationStart = new Date(period.applicationPeriod.start);
      const applicationEnd = new Date(period.applicationPeriod.end);
      return applicationStart <= today && applicationEnd >= today;
    });
  }

  return periods.some((period) => {
    const applicationStart = new Date(period.applicationPeriod.start);
    const applicationEnd = new Date(period.applicationPeriod.end);

    return (
      applicationStart <= today &&
      applicationEnd >= today &&
      (period.committees.includes(committee.name_short) ||
        period.optionalCommittees.includes(committee.name_short))
    );
  });
};

const isInterviewing = (committee: OwCommittee, periods: periodType[]) => {
  if (!Array.isArray(periods)) return false;

  const today = new Date();

  if (committee.name_short === "Bankom") {
    return periods.some((period) => {
      const interviewStart = new Date(period.interviewPeriod.start);
      const interviewEnd = new Date(period.interviewPeriod.end);
      return interviewStart <= today && interviewEnd >= today;
    });
  }

  return periods.some((period) => {
    const interviewStart = new Date(period.interviewPeriod.start);
    const interviewEnd = new Date(period.interviewPeriod.end);

    return (
      interviewStart <= today &&
      interviewEnd >= today &&
      (period.committees.includes(committee.name_short) ||
        period.optionalCommittees.includes(committee.name_short))
    );
  });
};

const Committees = () => {
  const [committees, setCommittees] = useState<OwCommittee[]>([]);
  const [nodeCommittees, setNodeCommittees] = useState<OwCommittee[]>([]);
  const [committeesWithPeriod, setCommitteesWithPeriod] = useState<
    OwCommittee[]
  >([]);
  const [periods, setPeriods] = useState<periodType[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  const {
    data: owCommitteeData,
    isError: owCommitteeIsError,
    isLoading: owCommitteeIsLoading,
  } = useQuery({
    queryKey: ["ow-committees"],
    queryFn: fetchOwCommittees,
  });

  const {
    data: periodsData,
    isError: periodsIsError,
    isLoading: periodsIsLoading,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: fetchPeriods,
  });

  useEffect(() => {
    if (!owCommitteeData) return;

    const filterNodeCommittees = owCommitteeData.filter(
      (committee: OwCommittee) => otherCommittees.includes(committee.name_short)
    );
    setNodeCommittees(shuffleList(filterNodeCommittees));

    let filteredCommittees = owCommitteeData.filter(
      (committee: OwCommittee) =>
        !excludedCommittees.includes(committee.name_short) &&
        !otherCommittees.includes(committee.name_short)
    );

    setCommittees(shuffleList(filteredCommittees));

    const filteredCommitteesWithPeriod = owCommitteeData.filter(
      (commitee: OwCommittee) =>
        (hasPeriod(commitee, periods) || isInterviewing(commitee, periods)) &&
        !excludedCommittees.includes(commitee.name_short)
    );

    setCommitteesWithPeriod(filteredCommitteesWithPeriod);

    if (filteredCommitteesWithPeriod.length > 0) setActiveTab(2);
  }, [owCommitteeData, periods]);

  useEffect(() => {
    if (!periodsData) return;

    setPeriods(periodsData.periods);
  }, [periodsData]);

  if (owCommitteeIsLoading || periodsIsLoading) return <LoadingPage />;
  if (owCommitteeIsError || periodsIsError) return <ErrorPage />;

  return (
    <div className="flex flex-col items-center gap-5">
      <MainTitle
        boldMainTitle={"Onlines komiteer"}
        subTitle={
          "Komitémedlemmer får Online til å gå rundt, og arbeider for at alle informatikkstudenter skal ha en flott studiehverdag."
        }
        boldSubTitle=""
      />

      <Tabs
        activeTab={activeTab}
        setActiveTab={(index) => {
          setActiveTab(index);
        }}
        content={[
          {
            title: "Komiteer",
            icon: <UsersIcon className="w-5 h-5" />,
            content: <CommitteList committees={committees} periods={periods} />,
          },
          {
            title: "Nodekomiteer",
            icon: <UserIcon className="w-5 h-5" />,
            content: (
              <CommitteList committees={nodeCommittees} periods={periods} />
            ),
          },
          ...(committeesWithPeriod.length > 0
            ? [
                {
                  title: "Har opptak",
                  icon: <BellAlertIcon className="w-5 h-5" />,
                  content: (
                    <CommitteList
                      committees={committeesWithPeriod}
                      periods={periods}
                    />
                  ),
                },
              ]
            : []),
        ]}
      />
    </div>
  );
};

export default Committees;

const CommitteList = ({
  committees,
  periods,
}: {
  committees: OwCommittee[];
  periods: periodType[];
}) => (
  <div className="w-10/12 px-4 mx-auto bg-white lg:px-6 dark:bg-gray-900">
    <div className="space-y-8 md:grid lg:grid-cols-2 md:gap-12 md:space-y-0">
      {committees
        ?.sort(
          (a, b) =>
            Number(hasPeriod(b, periods)) - Number(hasPeriod(a, periods))
        )
        .map((committee, index) => {
          return (
            <CommitteeAboutCard
              key={index}
              committee={committee}
              hasPeriod={hasPeriod(committee, periods)}
              isInterviewing={isInterviewing(committee, periods)}
            />
          );
        })}
    </div>
  </div>
);
