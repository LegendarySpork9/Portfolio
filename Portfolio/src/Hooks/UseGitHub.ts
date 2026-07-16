import { useQuery } from "@tanstack/react-query";
import { getUpcomingProjects } from "../API/GitHub.api";
import { queryKeys } from "../Lib/QueryKeys";

export function useUpcomingProjects() {
  return useQuery({
    queryKey: queryKeys.github.upcomingProjects,
    queryFn: getUpcomingProjects,
    staleTime: 10 * 60 * 1000
  });
}
