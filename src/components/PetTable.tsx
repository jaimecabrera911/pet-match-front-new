import { Pet } from "../db/schema";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface PetTableProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (petId: number) => void;
  isLoading?: boolean;
}

export function PetTable({ pets, onEdit, onDelete, isLoading }: PetTableProps) {
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Edad</TableHead>
            <TableHead>Raza</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell className="animate-pulse bg-muted h-4 w-20 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-12 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-24 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-32 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-16 rounded" />
              <TableCell className="animate-pulse bg-muted h-4 w-24 rounded" />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Raza</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pets.map((pet) => (
          <TableRow key={pet.id}>
            <TableCell className="font-medium">{pet.nombre}</TableCell>
            <TableCell>{pet.edad}</TableCell>
            <TableCell>{pet.raza}</TableCell>
            <TableCell>
              {pet.fundacionId}
            </TableCell>
            <TableCell>{pet.estadoAdopcion}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(pet)}
                  aria-label={`Editar ${pet.nombre}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDelete(pet.id)}
                  aria-label={`Eliminar ${pet.nombre}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
