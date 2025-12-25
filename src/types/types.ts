import { EventsABI } from "@/app/calls";
import { ParseEventLogsReturnType } from "viem";

export type Item = {
  id: number;
  title: string;
  votes: number;
  src: string;
};

export type ItemProps = {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}


export type QVEvent = ParseEventLogsReturnType<typeof EventsABI>[number];
