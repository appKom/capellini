import { useSession } from "next-auth/react";
import Table, { RowType } from "../../components/Table";
import Button from "../../components/Button";
import { useEffect, useState } from "react";
import { periodType } from "../../lib/types/types";
import { formatDate } from "../../lib/utils/dateUtils";
import NotFound from "../404";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deletePeriodById, fetchPeriods } from "../../lib/api/periodApi";
import LoadingPage from "../../components/LoadingPage";
import ErrorPage from "../../components/ErrorPage";
import toast from "react-hot-toast";

const Admin = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const [periods, setPeriods] = useState<RowType[]>([]);

  const {
    data: periodsData,
    isError: periodsIsError,
    isLoading: periodsIsLoading,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: fetchPeriods,
  });

  const deletePeriodByIdMutation = useMutation({
    mutationFn: deletePeriodById,
    onSuccess: () =>
      queryClient.invalidateQueries({
        // TODO: try to update cache instead
        queryKey: ["periods"],
      }),
  });

  useEffect(() => {
    if (!periodsData) return;

    setPeriods(
      periodsData.periods.map((period: periodType) => {
        return {
          id: period._id,
          name: period.name,
          application:
            formatDate(period.applicationPeriod.start) +
            " til " +
            formatDate(period.applicationPeriod.end),
          interview:
            formatDate(period.interviewPeriod.start) +
            " til " +
            formatDate(period.interviewPeriod.end),
          committees: period.committees,
          link: `/admin/${period._id}`,
        };
      })
    );
  }, [periodsData]);

  const deletePeriod = async (id: string, name: string) => {
    const isConfirmed = window.confirm(
      `Er det sikker på at du ønsker å slette ${name}?`
    );
    if (!isConfirmed) return;
    deletePeriodByIdMutation.mutate(id);
  };

  useEffect(() => {
    if (deletePeriodByIdMutation.isSuccess) toast.success("Periode slettet");
    if (deletePeriodByIdMutation.isError)
      toast.error("Noe gikk galt, prøv igjen");
  }, [deletePeriodByIdMutation]);

  const periodsColumns = [
    { label: "Navn", field: "name" },
    { label: "Søknad", field: "application" },
    { label: "Intervju", field: "interview" },
    { label: "Delete", field: "delete" },
  ];

  if (!session || session.user?.role !== "admin") return <NotFound />;
  if (periodsIsLoading) return <LoadingPage />;
  if (periodsIsError) return <ErrorPage />;

  return (
    <div className="flex flex-col items-center justify-center py-5">
      <h1 className="my-10 text-3xl font-semibold text-center dark:text-gray-200 text-online-darkBlue">
        Opptaksperioder
      </h1>

      <div className="pb-10">
        <Button
          title="Ny opptaksperiode"
          color="blue"
          href="/admin/new-period"
        />
      </div>

      {periods.length > 0 && (
        <Table
          columns={periodsColumns}
          rows={periods}
          onDelete={deletePeriod}
        />
      )}
    </div>
  );
};

export default Admin;
