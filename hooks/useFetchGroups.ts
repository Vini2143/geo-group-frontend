import { getMeGroups } from "@/services/groups";
import { useEffect, useState } from "react";


export function useFetchGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getMeGroups()
        setGroups(data);
      } catch (err) {
        console.error("Erro ao carregar grupos:", err);
      }
      
      setLoading(false)
    }

    fetchGroups()
  }, []);

  return { groups, loading };
}