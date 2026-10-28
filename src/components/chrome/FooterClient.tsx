"use client";
import { T } from "@/i18n/client";
/** The server Footer passes its English strings through this so they translate on the client. */
export function Tx({ children }: { children: string }) { return <T>{children}</T>; }
