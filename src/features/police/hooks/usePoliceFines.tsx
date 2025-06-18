import { useEffect, useState } from "react";
import { FineResponse } from "../../../types/Fine/FineResponse";
import { FineFilter } from "../../../types/Fine/FineFilter";
import { getPoliceFines } from "../../../services/fineService";

export function usePoliceFines() {
  const [fines, setFines] = useState<FineResponse[]>([]);
  const [filter, setFilter] = useState<FineFilter>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchFines = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getPoliceFines(filter, page, 10);
        setFines(data.items);
        setHasNextPage(data.hasNextPage);
      } catch {
        setError("Failed to load fines.");
      }

      setLoading(false);
    };

    fetchFines();
  }, [filter, page]);

  return {
    fines,
    filter,
    setFilter,
    page,
    setPage,
    loading,
    error,
    hasNextPage,
  };
}
