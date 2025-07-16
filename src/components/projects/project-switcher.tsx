// src/components/projects/project-switcher.tsx
"use client"

import * as React from "react"
import { ChevronsUpDown, PlusCircle, KanbanSquare } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"

const projects = [
    {
      value: "projeto-social",
      label: "Projeto Social",
      icon: KanbanSquare,
    },
    {
      value: "marketing",
      label: "Campanha de Marketing",
      icon: KanbanSquare,
    },
    {
      value: "website",
      label: "Desenvolvimento do Website",
      icon: KanbanSquare,
    },
    {
      value: "evento-beneficente",
      label: "Evento Beneficente",
      icon: KanbanSquare,
    },
]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ProjectSwitcherProps extends PopoverTriggerProps {}

export function ProjectSwitcher({ className }: ProjectSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedProject, setSelectedProject] = React.useState<typeof projects[0]>(projects[0])
  const router = useRouter();


  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn("w-[280px] justify-between text-3xl font-bold font-headline tracking-tight p-0 h-auto hover:bg-transparent", className)}
        >
          {selectedProject.label}
          <ChevronsUpDown className="ml-2 h-6 w-6 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Procurar projeto..." />
            <CommandEmpty>Nenhum projeto encontrado.</CommandEmpty>
            <CommandGroup heading="Projetos">
              {projects.map((project) => (
                <CommandItem
                  key={project.value}
                  onSelect={() => {
                    setSelectedProject(project)
                    setOpen(false)
                    router.push(`/dashboard/projects/${project.value}`)
                  }}
                  className="text-sm"
                >
                  <project.icon className="mr-2 h-4 w-4" />
                  {project.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  // Lógica para criar novo projeto
                  setOpen(false)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Novo Projeto
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
