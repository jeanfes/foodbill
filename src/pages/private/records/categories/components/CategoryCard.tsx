import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Package } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "@/interfaces/category";
import { Can } from "@/components/Can";
import { Permission } from "@/interfaces/role";

interface CategoryCardProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Package;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Card className="relative overflow-hidden hover:shadow-md transition-all duration-300 group py-1">
                <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`h-14 w-14 rounded-xl ${category.color} flex items-center justify-center`}>
                            <IconComponent className="h-7 w-7" />
                        </div>
                        <Can permission={Permission.UPDATE_CATEGORIES}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(category)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar
                                    </DropdownMenuItem>
                                    <Can permission={Permission.DELETE_CATEGORIES}>
                                        <DropdownMenuItem
                                            onClick={() => onDelete(category)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Eliminar
                                        </DropdownMenuItem>
                                    </Can>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </Can>
                    </div>
                    <div className="space-y-1 mb-3">
                        <h3 className="text-lg font-semibold truncate" title={category.name}>
                            {category.name}
                        </h3>
                        {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2" title={category.description}>
                                {category.description}
                            </p>
                        )}
                    </div>


                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                            {category.productCount} {category.productCount === 1 ? 'producto' : 'productos'}
                        </Badge>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
