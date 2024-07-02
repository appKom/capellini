import { useEffect, useState } from "react";
import Button from "../Button";
import TextAreaInput from "../form/TextAreaInput";
import LoadingPage from "../LoadingPage";
import { useRouter } from "next/router";
import { committeeInterviewType, periodType } from "../../lib/types/types";
import { useSession } from "next-auth/react";

interface Props {
  period: periodType | null;
}

const PlanInterview = ({ period }: Props) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const periodId = router.query["period-id"] as string;
  const [committeeInterviewTimes, setCommitteeInterviewTimes] = useState<
    committeeInterviewType[]
  >([]);
  const [userCommittees, setUserCommittees] = useState<string[]>([]);
  const [selectedCommittee, setSelectedCommittee] = useState<string>("");
  const [committeeHasSubmited, setCommitteeHasSubmited] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchCommitteeInterviewTimes = async () => {
      try {
        const res = await fetch(`/api/committees/times/${periodId}`);
        const data = await res.json();

        if (data && Array.isArray(data.committees)) {
          setCommitteeInterviewTimes(data.committees);
          setIsLoading(false);
        } else {
          console.error(
            "Fetched data does not contain an 'committees' array:",
            data
          );
          setCommitteeInterviewTimes([]);
        }
      } catch (error) {
        console.error("Error fetching committee interview times:", error);
        setCommitteeInterviewTimes([]);
      }
    };

    const getCommonCommittees = () => {
      if (session?.user?.committees && period?.committees) {
        const userCommittees = session.user.committees.map(
          (committee: string) => committee.toLowerCase()
        );
        const periodCommittees = period.committees.map((committee) =>
          committee.toLowerCase()
        );

        const commonCommittees = userCommittees.filter((committee: string) =>
          periodCommittees.includes(committee)
        );
        // console.log("Common committees:", commonCommittees);

        setUserCommittees(commonCommittees);

        if (commonCommittees.length > 0) {
          setSelectedCommittee(commonCommittees[0]);
        }
      }
    };

    getCommonCommittees();
    fetchCommitteeInterviewTimes();
  }, []);

  useEffect(() => {
    const committeeSubmitted = committeeInterviewTimes.some(
      (committee) => committee.committee === selectedCommittee
    );
    setCommitteeHasSubmited(committeeSubmitted);
  }, [selectedCommittee, committeeInterviewTimes]);

  useEffect(() => {}, [selectedCommittee, committeeHasSubmited]);

  const handleCommitteeSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCommittee(e.target.value);
  };

  while (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-bold text-3xl">Skriv en egendefinert melding!</h1>

      <div className="flex flex-col px-5">
        <label className="">Velg komitee: </label>
        <select
          className="p-2 ml-5 text-black border border-gray-300 dark:bg-online-darkBlue dark:text-white dark:border-gray-600"
          onChange={handleCommitteeSelection}
          value={selectedCommittee}
        >
          {userCommittees.map((committee) => (
            <option key={committee} value={committee}>
              {committee}
            </option>
          ))}
        </select>
      </div>

      {!committeeHasSubmited && (
        <p className="text-red-500">Du må først fylle inn intervjutider</p>
      )}

      {committeeHasSubmited && (
        <div className="items-center flex-col justify-center">
          <TextAreaInput updateInputValues={() => {}} label={""} />

          <Button title={"Send Melding"} color={"blue"} />
        </div>
      )}
    </div>
  );
};

export default PlanInterview;
