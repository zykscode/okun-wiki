import { handlers } from "@/lib/auth";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export const { GET, POST } = handlers;