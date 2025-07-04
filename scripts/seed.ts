import { db } from "@/lib/db/index"; // Ajuste o caminho conforme necessário
import { users } from "@/lib/db/schema"; // Ajuste o esquema do banco de dados
import bcrypt from "bcryptjs";

async function seedDatabase() {
  const adminEmail = "admin@company.com";
  const adminPassword = bcrypt.hashSync("112233", 10);

  const consultants = [
    { name: "Sergio Bandeira", email: "sergio@consult.com" },
    { name: "Mauricio Simões", email: "mauricio@consult.com" },
    { name: "Mayco Muniz", email: "mayco@consult.com" },
    { name: "Paulo Marcio", email: "paulo@consult.com" },
    { name: "Fernando Basil", email: "fernando@consult.com" },
    { name: "Lucas Almeida", email: "lucas@consult.com" },
  ];

  // Adiciona o usuário ADMIN
  await db.insert(users).values({ email: adminEmail, password: adminPassword, role: "ADMIN" });

  // Adiciona os usuários CONSULTANT
  for (const consultant of consultants) {
    const randomPassword = Math.random().toString(36).slice(-3); // Gera uma senha de 3 caracteres
    const hashedPassword = bcrypt.hashSync(randomPassword, 10);

    await db.insert(users).values({ email: consultant.email, password: hashedPassword, role: "CONSULTANT" });
    console.log(`Consultant ${consultant.name}: ${consultant.email}, Password: ${randomPassword}`);
  }
}

seedDatabase().catch(error => console.error("Error seeding database:", error));