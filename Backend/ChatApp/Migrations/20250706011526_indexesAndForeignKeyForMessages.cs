using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class indexesAndForeignKeyForMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Id",
                table: "Users",
                column: "Id",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message",
                columns: new[] { "SentAt", "ChannelId" });

            migrationBuilder.CreateIndex(
                name: "IX_Channels_ChannelId",
                table: "Channels",
                column: "ChannelId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message",
                column: "UserIdSender",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Users_Id",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Channels_ChannelId",
                table: "Channels");

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message",
                column: "UserIdSender",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
