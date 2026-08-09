"use client";

/**
 * External dependencies.
 */
import { CheckIcon, ChevronsUpDownIcon, BoxIcon, TriangleAlertIcon } from "lucide-react";

/**
 * Internal dependencies.
 */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBytes, formatModelName } from "@/lib/format";
import useApp from "@/hooks/useApp";

/**
 * Picks which `.gguf` model answers the next message.
 */
export const ModelSwitcher = () => {
  const { models, modelsStatus, selectedModel, setSelectedModel } = useApp();

  const activeModel = models.find((model) => model.name === selectedModel);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Model</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            {modelsStatus === "loading" ? (
              <div className="flex h-12 items-center gap-2 rounded-md px-2">
                <Skeleton className="size-8 shrink-0 rounded-md" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-2.5 w-16" />
                </div>
              </div>
            ) : models.length === 0 ? (
              <div className="flex items-start gap-2 rounded-md border border-dashed px-3 py-2.5 text-xs text-muted-foreground">
                <TriangleAlertIcon
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <span>
                  No models found. Add a{" "}
                  <code className="rounded bg-muted px-1 py-0.5 font-mono">.gguf</code>{" "}
                  file to the <span className="font-medium">models</span> folder and
                  reload.
                </span>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    aria-label={`Model: ${formatModelName(selectedModel)}. Change model`}
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                      <BoxIcon className="size-4" />
                    </div>
                    <div className="grid min-w-0 flex-1 text-left leading-tight">
                      <span className="truncate text-sm font-medium">
                        {formatModelName(selectedModel) || "Select a model"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {activeModel
                          ? formatBytes(activeModel.sizeInBytes)
                          : `${models.length} available`}
                      </span>
                    </div>
                    <ChevronsUpDownIcon className="ml-auto size-4 shrink-0 opacity-60" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="min-w-(--radix-dropdown-menu-trigger-width) max-w-[min(20rem,calc(100vw-2rem))]"
                >
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    {models.length} model{models.length === 1 ? "" : "s"} in the models
                    folder
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {models.map((model) => (
                    <DropdownMenuItem
                      key={model.name}
                      onSelect={() => setSelectedModel(model.name)}
                      className="gap-3"
                    >
                      <div className="grid min-w-0 flex-1">
                        <span className="truncate">{formatModelName(model.name)}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {formatBytes(model.sizeInBytes)}
                        </span>
                      </div>
                      {model.name === selectedModel && (
                        <CheckIcon className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
