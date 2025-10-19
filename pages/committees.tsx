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
import { shuffleList, partition } from "../lib/utils/arrays";

// TODO: Seems like a workaround, should be handled in OW API?
const excludedCommittees = ["Faddere", "Output"];

// TODO: Seems like a workaround, should be handled in OW API?
// List of committees that should be under the tab "Nodekomitéer"
const committeesUnderNodeCommitteesTab = [
  "Jubkom",
  "Velkom",
  "Ekskom",
  "Debug",
];

// Page Component
export default function Committees() {
  const [committees, setCommittees] = useState<OwCommittee[]>([]);
  const [nodeCommittees, setNodeCommittees] = useState<OwCommittee[]>([]);
  const [committeesInActivePeriod, setCommitteesWithPeriod] = useState<
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

    // Filter out excluded committees
    const nonExcludedCommittees = owCommitteeData.filter(
      (committee) => !excludedCommittees.includes(committee.name_short)
    );

    const [filteredNonNodeCommittees, filteredNodeCommittees] = partition(
      nonExcludedCommittees,
      (committee: OwCommittee) =>
        !committeesUnderNodeCommitteesTab.includes(committee.name_short)
    );

    setCommittees(shuffleList(filteredNonNodeCommittees));
    setNodeCommittees(shuffleList(filteredNodeCommittees));

    const filteredCommitteesInActivePeriod = nonExcludedCommittees.filter(
      (commitee: OwCommittee) =>
        committeeIsInActivePeriod(commitee, periods) ||
        committeeIsCurrentlyInterviewing(commitee, periods)
    );
    setCommitteesWithPeriod(filteredCommitteesInActivePeriod);

    // Autoopen tab for committees in active period if there is currently an active period
    if (filteredCommitteesInActivePeriod.length > 0) setActiveTab(2);
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
            content: (
              <CommitteeList committees={committees} periods={periods} />
            ),
          },
          {
            title: "Nodekomiteer",
            icon: <UserIcon className="w-5 h-5" />,
            content: (
              <CommitteeList committees={nodeCommittees} periods={periods} />
            ),
          },
          ...(committeesInActivePeriod.length > 0
            ? [
                {
                  title: "Har opptak",
                  icon: <BellAlertIcon className="w-5 h-5" />,
                  content: (
                    <CommitteeList
                      committees={committeesInActivePeriod}
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
}

const CommitteeList = ({
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
            Number(committeeIsInActivePeriod(b, periods)) -
            Number(committeeIsInActivePeriod(a, periods))
        )
        .map((committee, index) => {
          return (
            <CommitteeAboutCard
              key={index}
              committee={committee}
              hasPeriod={committeeIsInActivePeriod(committee, periods)}
              isInterviewing={committeeIsCurrentlyInterviewing(
                committee,
                periods
              )}
            />
          );
        })}
    </div>
  </div>
);

/**
 *
 * @param committee
 * @param periods list of all periods
 * @returns true if *committee* is either a committee or an optional committee in a period that is currently open for application
 */
const committeeIsInActivePeriod = (
  committee: OwCommittee,
  periods: periodType[]
) => {
  if (!Array.isArray(periods)) return false;

  const today = new Date();

  const activePeriods = periods.filter((period) => {
    const applicationStart = new Date(period.applicationPeriod.start);
    const applicationEnd = new Date(period.applicationPeriod.end);
    return applicationStart <= today && applicationEnd >= today;
  });

  // Bankom is always active, since you can be a representative of bankom from each committee
  if (committee.name_short === "Bankom") {
    return activePeriods.length > 0;
  }

  return activePeriods.some(
    (period) =>
      period.committees.includes(committee.name_short) ||
      period.optionalCommittees.includes(committee.name_short)
  );
};

const committeeIsCurrentlyInterviewing = (
  committee: OwCommittee,
  periods: periodType[]
) => {
  if (!Array.isArray(periods)) return false;

  const today = new Date();

  const periodsWithInterviewsCurrently = periods.filter((period) => {
    const interviewStart = new Date(period.interviewPeriod.start);
    const interviewEnd = new Date(period.interviewPeriod.end);
    return interviewStart <= today && interviewEnd >= today;
  });

  // Bankom is always active, since you can be a representative of bankom from each committee
  if (committee.name_short === "Bankom") {
    return periodsWithInterviewsCurrently.length > 0;
  }

  return periodsWithInterviewsCurrently.some(
    (period) =>
      period.committees.includes(committee.name_short) ||
      period.optionalCommittees.includes(committee.name_short)
  );
};
