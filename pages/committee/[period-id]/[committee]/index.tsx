import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  committeeInterviewType,
  periodType,
} from "../../../../lib/types/types";
import { useRouter } from "next/router";
import ApplicantsOverview from "../../../../components/applicantoverview/ApplicantsOverview";
import {
  CalendarIcon,
  InboxIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Tabs } from "../../../../components/Tabs";
import SendCommitteeMessage from "../../../../components/committee/SendCommitteeMessage";
import CommitteeInterviewTimes from "../../../../components/committee/CommitteeInterviewTimes";
import LoadingPage from "../../../../components/LoadingPage";
import { changeDisplayName } from "../../../../lib/utils/toString";
import Custom404 from "../../../404";
import PageTitle from "../../../../components/PageTitle";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchPeriodById } from "../../../../lib/api/periodApi";
import ErrorPage from "../../../../components/ErrorPage";
import { fetchCommitteeTimes } from "../../../../lib/api/committeesApi";

const CommitteeApplicantOverview: NextPage = () => {
  const { data: session } = useSession();
  const { query } = useRouter();
  const periodId = query["period-id"] as string;
  const committee = query["committee"] as string;

  const [activeTab, setActiveTab] = useState(0);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [singleCommitteeInPeriod, setSingleCommitteeInPeriod] =
    useState<boolean>(true);

  const {
    data: periodData,
    isError: periodIsError,
    isLoading: periodIsLoading,
  } = useQuery({
    queryKey: ["period", periodId],
    queryFn: fetchPeriodById,
    enabled: !!periodId,
  });

  const {
    data: interviewTimesData,
    isError: interviewTimesIsError,
    isLoading: interviewTimesIsLoading,
    refetch: refetchInterviewTimes,
  } = useQuery({
    queryKey: ["interviewTimes", periodId, committee],
    queryFn: fetchCommitteeTimes,
    enabled: !!periodId && !!committee,
  });

  const period: periodType = periodData?.period;
  const committeeInterviewTimes: committeeInterviewType =
    interviewTimesData?.committees[0];

  useEffect(() => {
    if (!periodData?.period) return;

    const userCommittees =
      session?.user?.committees?.map((c) => c.toLowerCase()) || [];
    const periodCommittees = [
      ...periodData.period.committees,
      ...periodData.period.optionalCommittees,
    ].map((c) => c.toLowerCase());

    const commonCommittees = userCommittees.filter((committee) =>
      periodCommittees.includes(committee)
    );

    setSingleCommitteeInPeriod(commonCommittees.length === 1);
    setHasAccess(commonCommittees.includes(committee.toLowerCase()));
  }, [periodData, session, committee]);

  if (periodIsLoading || interviewTimesIsLoading) return <LoadingPage />;
  if (periodIsError || interviewTimesIsError) return <ErrorPage />;
  if (!hasAccess) return <Custom404 />;

  const interviewPeriodEnd = period?.interviewPeriod.end
    ? new Date(period.interviewPeriod.end)
    : null;

  // Satt frist til 14 dager etter intervju perioden, så får man ikke tilgang
  const interviewAccessExpired =
    interviewPeriodEnd &&
    interviewPeriodEnd.getTime() + 14 * 24 * 60 * 60 * 1000 <
      new Date().getTime();

  if (interviewAccessExpired) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-20 text-center">
        <h1 className="text-3xl">Opptaket er ferdig!</h1>
        <br />
        <p className="text-lg">
          Du kan ikke lenger se søkere eller planlegge intervjuer.
        </p>
        <p className="text-lg">
          Har det skjedd noe feil eller trenger du tilgang til informasjonen? Ta
          kontakt med{" "}
          <a
            className="font-semibold underline transition-all hover:text-online-orange"
            href="mailto:appkom@online.ntnu.no"
          >
            Appkom
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <PageTitle
        boldMainTitle={period?.name}
        subTitle={
          <div className="inline-flex flex-row items-center">
            {changeDisplayName(committee)}
            {!singleCommitteeInPeriod && (
              <Link href={`/committee/${periodId}`}>
                <a className="ml-1 text-sm text-blue-500 hover:text-blue-800">
                  (Bytt)
                </a>
              </Link>
            )}
          </div>
        }
        boldSubTitle="Komité"
      />

      <Tabs
        activeTab={activeTab}
        setActiveTab={(index) => {
          refetchInterviewTimes();
          setActiveTab(index);
        }}
        content={[
          {
            title: "Intervjutider",
            icon: <CalendarIcon className="w-5 h-5" />,
            content: (
              <CommitteeInterviewTimes
                period={period}
                committee={committee}
                committeeInterviewTimes={committeeInterviewTimes}
              />
            ),
          },
          {
            title: "Melding",
            icon: <InboxIcon className="w-5 h-5" />,
            content: (
              <SendCommitteeMessage
                period={period}
                committee={committee}
                committeeInterviewTimes={committeeInterviewTimes}
              />
            ),
          },
          {
            title: "Søkere",
            icon: <UserGroupIcon className="w-5 h-5" />,
            content: (
              <ApplicantsOverview
                period={period}
                committee={committee}
                includePreferences={false}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default CommitteeApplicantOverview;
