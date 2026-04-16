using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EnergyHub.API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateWithUsuarioId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Contratos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Consumos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioId",
                table: "Clientes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Contratos_UsuarioId",
                table: "Contratos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Consumos_UsuarioId",
                table: "Consumos",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Clientes_UsuarioId",
                table: "Clientes",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Clientes_Usuarios_UsuarioId",
                table: "Clientes",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Consumos_Usuarios_UsuarioId",
                table: "Consumos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Contratos_Usuarios_UsuarioId",
                table: "Contratos",
                column: "UsuarioId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Clientes_Usuarios_UsuarioId",
                table: "Clientes");

            migrationBuilder.DropForeignKey(
                name: "FK_Consumos_Usuarios_UsuarioId",
                table: "Consumos");

            migrationBuilder.DropForeignKey(
                name: "FK_Contratos_Usuarios_UsuarioId",
                table: "Contratos");

            migrationBuilder.DropIndex(
                name: "IX_Contratos_UsuarioId",
                table: "Contratos");

            migrationBuilder.DropIndex(
                name: "IX_Consumos_UsuarioId",
                table: "Consumos");

            migrationBuilder.DropIndex(
                name: "IX_Clientes_UsuarioId",
                table: "Clientes");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Contratos");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Consumos");

            migrationBuilder.DropColumn(
                name: "UsuarioId",
                table: "Clientes");
        }
    }
}
