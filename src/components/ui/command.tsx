"use client";

import * as React from "react";
import { Command, CommandContent, CommandItem, CommandShortcut, CommandTrigger } from "@/lib/cmdk";

/**
 * Command (Command Palette) component
 * Rota: /command ou ativado via atalho
 */
export default function CommandPalette() {
  return (
    <Command>
      <CommandTrigger />
      <CommandContent>
        <CommandItem command="pastah">
          Pastah
        </CommandItem>
      </CommandContent>
    </Command>
  );
}