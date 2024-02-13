import { GenericObject } from "@/types";
import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, GenericObject>({
  max: 100,
  maxSize: 1000,
  sizeCalculation: () => 1,
  ttl: 1000 * 60, // one minute
});

export default cache;
