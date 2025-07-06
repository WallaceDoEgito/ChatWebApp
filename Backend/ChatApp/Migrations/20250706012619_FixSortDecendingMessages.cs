using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class FixSortDecendingMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message");

            migrationBuilder.CreateIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message",
                columns: new[] { "SentAt", "ChannelId" },
                descending: new[] { true, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message");

            migrationBuilder.CreateIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message",
                columns: new[] { "SentAt", "ChannelId" });
        }
    }
}
