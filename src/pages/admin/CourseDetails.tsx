import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the CourseStatus type
type CourseStatus = "Ativo" | "Inativo" | "Em Breve" | "Descontinuado";

// расширяем интерфейс, добавляя courseId
interface Course {
    id: string;
    courseId: string;
    name: string;
    status: CourseStatus;
    platform: string;
    platformLink: string;
    salesPageLink: string;
    accessPeriod: number;
    createdAt: Date;
    price: number;
}

const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [course, setCourse] = useState<Course>({
        id: "",
        courseId: "",
        name: "",
        status: "Ativo",
        platform: "",
        platformLink: "",
        salesPageLink: "",
        accessPeriod: 0,
        createdAt: new Date(),
        price: 0,
    });

    useEffect(() => {
        // Fetch course details when the component mounts
        if (id) {
            // Simulate fetching course data from an API
            setTimeout(() => {
                const mockCourseData: Course = {
                    id: id,
                    courseId: "CRS123",
                    name: "Curso de React Avançado",
                    status: "Ativo",
                    platform: "Hotmart",
                    platformLink: "https://hotmart.com/pt-BR",
                    salesPageLink: "https://example.com/sales",
                    accessPeriod: 365,
                    createdAt: new Date(),
                    price: 997.00,
                };
                setCourse(mockCourseData);
            }, 500);
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCourse(prevCourse => ({
            ...prevCourse,
            [name]: value,
        }));
    };

    const handleStatusChange = (status: CourseStatus) => {
        setCourse(prevCourse => ({
            ...prevCourse,
            status: status,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the updated course data to your API
        toast.success("Curso atualizado com sucesso!");
        navigate('/admin/courses'); // Redirect to the courses list page
    };

    if (!course.id) {
        return <div>Carregando detalhes do curso...</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Curso</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Nome do Curso</Label>
                                <Input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={course.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="courseId">ID do Curso</Label>
                                <Input
                                    type="text"
                                    id="courseId"
                                    name="courseId"
                                    value={course.courseId}
                                    onChange={handleInputChange}
                                    disabled // Assuming courseId should not be edited
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                <Select onValueChange={handleStatusChange}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder={course.status} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Ativo">Ativo</SelectItem>
                                        <SelectItem value="Inativo">Inativo</SelectItem>
                                        <SelectItem value="Em Breve">Em Breve</SelectItem>
                                        <SelectItem value="Descontinuado">Descontinuado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="platform">Plataforma</Label>
                                <Input
                                    type="text"
                                    id="platform"
                                    name="platform"
                                    value={course.platform}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="platformLink">Link da Plataforma</Label>
                                <Input
                                    type="url"
                                    id="platformLink"
                                    name="platformLink"
                                    value={course.platformLink}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="salesPageLink">Link da Página de Vendas</Label>
                                <Input
                                    type="url"
                                    id="salesPageLink"
                                    name="salesPageLink"
                                    value={course.salesPageLink}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="accessPeriod">Período de Acesso (dias)</Label>
                                <Input
                                    type="number"
                                    id="accessPeriod"
                                    name="accessPeriod"
                                    value={course.accessPeriod}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="price">Preço</Label>
                                <Input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={course.price}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="createdAt">Data de Criação</Label>
                            <Input
                                type="text"
                                id="createdAt"
                                name="createdAt"
                                value={course.createdAt.toLocaleDateString()}
                                disabled // Assuming createdAt should not be edited
                            />
                        </div>
                        <Button type="submit">Atualizar Curso</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CourseDetails;
