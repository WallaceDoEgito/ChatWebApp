using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class NewIndexAndSetNullForMessagesForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserIdSender",
                table: "Message",
                type: "uuid",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uuid");

            migrationBuilder.CreateIndex(
                name: "IX_Message_SentAt_ChannelId_MessageId",
                table: "Message",
                columns: new[] { "SentAt", "ChannelId", "MessageId" },
                descending: new[] { true, false, false });

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message",
                column: "UserIdSender",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message");

            migrationBuilder.DropIndex(
                name: "IX_Message_SentAt_ChannelId_MessageId",
                table: "Message");

            migrationBuilder.AlterColumn<Guid>(
                name: "UserIdSender",
                table: "Message",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Message_SentAt_ChannelId",
                table: "Message",
                columns: new[] { "SentAt", "ChannelId" },
                descending: new[] { true, false });

            migrationBuilder.AddForeignKey(
                name: "FK_Message_Users_UserIdSender",
                table: "Message",
                column: "UserIdSender",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
