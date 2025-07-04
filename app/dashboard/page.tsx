import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { db } from "@/lib/db/index"; // Ajuste o caminho conforme necessário
import { documents } from "@/lib/db/schema"; // Ajuste conforme seu esquema
import { DataTable } from "@/components/ui/data-table"; // Certifique-se de que este componente existe

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Você precisa estar logado para acessar esta página.</div>;
  }

  const userRole = session.user.role;
  let userDocuments = [];

  try {
    if (userRole === "ADMIN") {
      userDocuments = await db.select().from(documents); // Obtenha todos os documentos
    } else if (userRole === "CONSULTANT") {
      userDocuments = await db.select().from(documents).where({ consultantId: session.user.id }); // Filtra por consultor
    }
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return <div>Erro ao carregar documentos.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <DataTable data={userDocuments} /> {/* Supondo que DataTable aceite esses dados */}
    </div>
  );
};

export default DashboardPage;