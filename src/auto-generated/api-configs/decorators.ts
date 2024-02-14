import { GenericObject, Payload } from "@/types";
import { RequestDecorator } from "./enums";

type RequestDecoratorHandler = (
  payload: Payload,
  data: GenericObject,
) => GenericObject;

export const decorators = {} as Record<
  RequestDecorator,
  RequestDecoratorHandler
>;
