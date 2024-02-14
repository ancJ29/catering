import { GenericObject } from "@/types";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, GenericObject>({
  max: 100000,
  maxSize: 100000,
  sizeCalculation: () => 1,
  ttl: 1000 * 60 * 5, // five minute
});

export default cache;
