import Link from "next/link";
import { TownService } from "@/services/town.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function AdminTownsPage() {
  const towns = await TownService.getAdminTowns();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Towns</h1>
          <p className="text-muted-foreground">Manage the towns available on Okunpedia.</p>
        </div>
        <Link href="/admin/towns/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Town
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>LGA</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {towns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No towns found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              towns.map((town) => (
                <TableRow key={town.id}>
                  <TableCell className="font-medium">
                    {town.name}
                    {town.featured && (
                      <Badge variant="earth" className="ml-2">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{town.lga.name}</TableCell>
                  <TableCell>
                    {town.published ? (
                      <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20">
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="earth">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/towns/${town.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
