import { EventsABI } from "@/app/calls";
import { ParseEventLogsReturnType } from "viem";

export type Item = {
  id: number;
  title: string;
  votes: number;
};

export type QVEvent = ParseEventLogsReturnType<typeof EventsABI>[number];
