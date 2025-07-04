import { SessionProvider } from "@/components/session-provider"; // Verifique o caminho
import { LogoutButton } from "@/components/logout-button"; // Verifique o caminho

export default function Layout({ children }) {
  return (
    <div>
      <header>
        <h1>Bem-vindo, [Nome do Usuário]</h1> {/* Coloque a lógica para obter o nome */}
        <LogoutButton />
      </header>
      <main>{children}</main>
    </div>
  );
}