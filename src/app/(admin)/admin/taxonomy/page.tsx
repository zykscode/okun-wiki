import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminTaxonomyPage() {
  const [tags, lgas, tribes] = await Promise.all([
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.lGA.findMany({ include: { state: true }, orderBy: { name: "asc" } }),
    prisma.tribe.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Taxonomy Management</h1>
        <p className="text-muted-foreground">Manage classification data: Tags, LGAs, and Tribes.</p>
      </div>

      <Tabs defaultValue="tags" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="tags">Tags ({tags.length})</TabsTrigger>
          <TabsTrigger value="lgas">LGAs ({lgas.length})</TabsTrigger>
          <TabsTrigger value="tribes">Tribes ({tribes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="tags">
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      No tags found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{tag.slug}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="lgas">
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lgas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      No LGAs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  lgas.map((lga) => (
                    <TableRow key={lga.id}>
                      <TableCell className="font-medium">{lga.name}</TableCell>
                      <TableCell>
                        <Badge variant="earth">{lga.state.name}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="tribes">
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tribes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                      No tribes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  tribes.map((tribe) => (
                    <TableRow key={tribe.id}>
                      <TableCell className="font-medium">{tribe.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {tribe.description || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
